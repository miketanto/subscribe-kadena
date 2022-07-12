(namespace "free")

(module transferable-subscribe-policy GOVERNANCE

  @doc "Policy for transferable subscriber protocol"

  (defcap GOVERNANCE ()
    ;; Enforces keyset that could update policy
    (enforce-guard (keyset-ref-guard 'marmalade-admin )))

  ;;Supported Fungible-v2 token import
  (use coin)

  ;;Token Policy Standard Interface
  ;; Enforce init, mint, sale, offer, buy, transfer, burn
  (implements kip.token-policy-v1)
  (use kip.token-policy-v1 [token-info])



  ;;Schema for subscription policy table
  ;;Data that will vary from policy to policy
  ;;Owner Royalty --- royalty set on rent to other people
  (defschema policy-schema
    provider-account:string
    provider-guard:guard
    owner-guard:guard
    renter-guard:guard
    provider-royalty:decimal
    owner-royalty:decimal
    trial-period:decimal
    grace-period:decimal
    pausable:string
    interval:decimal
    expiry-time:time
    first-start-time:time
    rent-start-time:time
    rent-end-time:time
    min-amount:decimal
    max-supply:decimal
  )
  (deftable policies:{policy-schema})

  ;;Quote is the mechanism for trade after mint

  (defun get-policy:object{policy-schema} (token:object{token-info})
    (read policies (at 'id token))
  )

  (defun enforce-ledger:bool ()
     (enforce-guard (marmalade.ledger.ledger-guard))
   )

   (defun enforce-protocol:bool ()
    (enforce-guard (keyset-ref-guard "protocol-keyset"))
   )
  
   (defun enforce-rent-pact:bool (rent-id:string)
    "Enforces that SALE is id for currently executing pact"
    (enforce (= rent-id (pact-id)) "Invalid pact/rent id")
   )

   (defun enforce-init:bool
    ( token:object{token-info})

    (enforce-ledger)
    ;;(enforce-guard (read-keyset 'provider-guard ))

    (let* ( (provider-guard:guard (read-keyset 'provider-guard ))
            (provider-account:string (read-msg 'provider-account ))
            (owner-guard:guard (read-keyset 'owner-guard ))
            (renter-guard:guard (read-keyset 'renter-guard ))
            (provider-royalty:decimal (read-decimal 'provider-royalty ))
            (owner-royalty:decimal (read-decimal 'owner-royalty ))
            (trial-period:decimal (read-decimal 'trial-period ))
            (grace-period:decimal  (read-decimal 'grace-period ))
            (pausable:string (read-msg 'pausable ))
            (expiry-time:time (time (read-string 'expiry-time )))
            (interval:decimal (read-decimal 'interval ))
            (first-start-time:time (time (read-string 'first-start-time )))
            (rent-start-time:time (time "0000-00-00T00:00:00Z"))
            (rent-end-time:time (time "0000-00-00T00:00:00Z"))
            (min-amount:decimal (read-decimal 'min-amount ))
            (max-supply:decimal (read-decimal 'max-supply ))
            )
    (enforce (>= min-amount 0.0) "Invalid min-amount")
    (enforce (= max-supply 1.0) "Invalid max-supply")
    (insert policies (at 'id token) 
    {"provider-guard":provider-guard, 
    "provider-account":provider-account,
    "owner-guard":owner-guard,
    "renter-guard":renter-guard,
    "provider-royalty":provider-royalty,
    "owner-royalty":owner-royalty,
    "trial-period":trial-period,
    "grace-period":grace-period,
    "pausable":pausable,
    "expiry-time":expiry-time,
    "interval":interval,
    "first-start-time":first-start-time, 
    "rent-start-time":rent-start-time, 
    "rent-end-time":rent-end-time, 
    "min-amount":min-amount, 
    "max-supply":max-supply}
    )
    true)
  )

  ;;Only subscription module can mint
  ;;Mint Guard is the subscription module
  ;;Need a price environment variable
  (defun enforce-mint:bool
    ( token:object{token-info}
      account:string
      guard:guard
      amount:decimal
    )
    (enforce-ledger)
    (enforce-integer amount)
    (bind (get-policy token)
    { 'owner-guard:=owner-guard:guard
    , 'provider-guard := provider-guard:guard
    , 'min-amount:=min-amount:decimal
    , 'max-supply:=max-supply:decimal
    }
    ;;Only designated owner could m int
    (enforce-guard owner-guard)
    ;;See if there is enough funds in the buyer account
    ;;Transfer funds to the provider account
    (let* 
      ((token-mint-price:decimal (read-decimal 'token-mint-price ))
       (provider-account:string (read-msg 'provider-account )))
      ;token-mint-price
      ;;Owner of coins (e.g. consumer) 
      (coin.transfer account provider-account token-mint-price))
    
    (enforce (>= amount min-amount) "mint amount < min-amount")
    (enforce (<= (+ amount (at 'supply token)) max-supply) "Exceeds max supply")
    (bind (chain-data){'block-time := current-time}
      (update policies (at 'id token) { "first-start-time" : current-time })
    )
))

  ;;Types of Transfers
  ;; A.Expiry Transfers
  ;;    1.WITHDRAW -- Need to know that it is past expiry
  ;;    2.EXTEND -- Transfer back to owner if he resubscribes
  ;; B. Lending Transfers
  ;;    1.LEND_WITHDRAW --
  ;;
  (defcap EXTEND (token:object{token-info} extender-account:string token-extend-price:decimal)
  @managed
   (compose-capability (UPDATE_EXPIRY))
  )

  (defcap WITHDRAW_TOKEN (token:object{token-info} owner:string provider:string withdraw-time:time)
      @event
      "WITHDRAW_TOKEN"
  )

  
  (defcap WITHDRAW_RENT (token:object{token-info} owner:string renter:string withdraw-time:time)
      @event
      "WITHDRAW_RENT"
  )

  (defcap EXTENDED(token:object{token-info} owner:string provider:string old-expiry-time:time new-expiry-time:time)
      @event
      "EXTENDED"
  )

  (defcap UPDATE_EXPIRY()
  "private cap for update-expiry"
  true)

  (defun get-new-expiry-time (token:object{token-info})
    (bind (get-policy token) {"expiry-time":= old-expiry-time, "interval":= interval}
      (let* ((new-expiry-time:time (add-time old-expiry-time interval)))
        new-expiry-time
      )
    )
  )
  
  (defun update-expiration (token:object{token-info})
    (require-capability (UPDATE_EXPIRY))
    (let* ((new-expiry-time:time (get-new-expiry-time token)))
      (update policies (at 'id token) { "expiry-time" : new-expiry-time })
    )
  )
  
  (defun withdraw (token:object{token-info} provider-guard:guard owner-guard:guard receiver-guard:guard expiry-time:time provider:string owner:string)
      ;;Only could withdraw to provider
      (enforce-guard owner-guard)
      (enforce (= receiver-guard provider-guard) "Only could withdraw to provider")
      ;;Check for past rent expiry
      (bind (chain-data){'block-time := current-time}
        (enforce (> current-time expiry-time) "Subscription not yet expired")
        (emit-event (WITHDRAW_TOKEN token owner provider current-time))
      )
  )

  (defun withdraw-rental (token:object{token-info} owner-guard:guard renter-guard:guard receiver-guard:guard owner:string renter:string rent-end-time:time)
      ;;Only could withdraw to provider
      (enforce-guard renter-guard)
      (enforce (= receiver-guard owner-guard) "Only could withdraw to owner")
      ;;Check for past rent expiry
      (bind (chain-data){'block-time := current-time}
        (enforce (> current-time rent-end-time) "Subscription Rental not yet expired")
        (emit-event (WITHDRAW_RENT token renter owner current-time))
      )
  )

  (defun extend (token:object{token-info} owner-guard:guard provider-guard:guard receiver-guard:guard extender-account:string provider-account:string 
    token-extend-price:decimal expiry-time:time)
      (enforce-guard provider-guard)
      (enforce (= receiver-guard owner-guard) "Only owner could be transferred to for extend")
      (with-capability (EXTEND token extender-account token-extend-price)
        (coin.transfer extender-account provider-account token-extend-price)
        (update-expiration token)
        (emit-event (EXTENDED token extender-account provider-account expiry-time (get-new-expiry-time token)))
      )
  )
 
  (defun enforce-integer (number:decimal)
    ;;Floor and ceil are same in an integer 
    (let* ((floor-number:integer (floor number))
          (ceil-number:integer (ceiling number)))
      (enforce (= floor-number ceil-number) "Number must be an integer decimal")
  ))


  (defun enforce-transfer:bool
    ( token:object{token-info}
      sender:string
      guard:guard
      receiver:string
      amount:decimal )
    (enforce-ledger)
    (enforce-integer amount)
    (let* 
      ((sender-guard:guard (at 'guard (coin.details sender)))
       (receiver-guard:guard (at 'guard (coin.details receiver)))      
      )
      (bind (get-policy token) {"owner-guard":=owner-guard, "provider-guard":=provider-guard, "renter-guard":=renter-guard, "expiry-time":=expiry-time, "rent-end-time":=rent-end-time}
        (if (= sender-guard owner-guard)
          ;;Withdraw operation
          (withdraw token provider-guard owner-guard receiver-guard expiry-time receiver sender)

          (if (= sender-guard provider-guard)
            ;;Extend Operation
            ;;receiver here is the extender
            ;;sender here is the provider
            (extend token owner-guard provider-guard receiver-guard receiver sender (read-decimal 'token-extend-price ) expiry-time)
          
            ;;If not a owner or provider that calls transfer it isn't possible
            (if (= sender-guard renter-guard)
              (withdraw-rental token owner-guard renter-guard receiver-guard receiver sender rent-end-time)
              false
            )
          )
        )
      )
    )
  )

  (defcap QUOTE:bool
    ( sale-id:string
      token-id:string
      amount:decimal
      price:decimal
      sale-price:decimal
      spec:object{quote-spec}
    )
    @doc "For event emission purposes"
    @event
    true
  )

  (defconst QUOTE-MSG-KEY "quote"
    @doc "Payload field for quote spec")

    ;;Recipient is seller (recipient of fungible token) 
  (defschema quote-spec
    @doc "Quote data to include in payload"
    price:decimal
    recipient:string
    recipient-guard:guard
    designated-buyer:string
    designated-buyer-guard:guard
    renter-subsidy:decimal
    rent-interval:decimal
  )

  (defschema quote-schema
    id:string
    spec:object{quote-spec})

  (deftable quotes:{quote-schema})

  (defun enforce-designated-buyer (buyer:string guard:guard)
    (and (> (length buyer) 0) (= guard (at 'guard (coin.details buyer))))
  )
  (defun enforce-offer:bool
    ( token:object{token-info}
      seller:string
      amount:decimal
      sale-id:string
    )
    @doc "Capture quote spec for SALE of TOKEN from message"
    (enforce-ledger)
    (enforce-rent-pact sale-id)
    (enforce-integer amount)
    (let* ( (spec:object{quote-spec} (read-msg QUOTE-MSG-KEY))
            (price:decimal (at 'price spec))
            (recipient:string (at 'recipient spec))
            (recipient-guard:guard (at 'recipient-guard spec))
            (recipient-details:object (coin.details recipient))
            (sale-price:decimal (* amount price)) 
            (designated-buyer:string (at 'designated-buyer spec))
            (designated-buyer-guard:guard (at 'designated-buyer-guard spec))
            )
      (coin.enforce-unit sale-price)
      ;;Airdrop if there is designated buyer &&designated-buyer exists&&designated-buyer-guard == designated-buyer's guard
      (if (enforce-designated-buyer designated-buyer designated-buyer-guard)
        (enforce (<= 0.0 price) "Offer price must be positive or free")
        (enforce (< 0.0 price) "Offer price must be positive")
      )
      (enforce (=
        (at 'guard recipient-details) recipient-guard)
        "Recipient guard does not match")
      (insert quotes sale-id { 'id: (at 'id token), 'spec: spec })
      (emit-event (QUOTE sale-id (at 'id token) amount price sale-price spec)))
      true
  )

  (defcap RENT_START:bool
    ( 
      token:object{token-info}
      renter-guard:guard
      rent-start-time:time
      rent-end-time:time
    )
    @doc "For event emission purposes"
    @event
    true
  )

  (defun enforce-buy:bool
    ( token:object{token-info}
      seller:string
      buyer:string
      buyer-guard:guard
      amount:decimal
      sale-id:string )
    (enforce-ledger)
    (enforce-rent-pact sale-id)
    (enforce-integer amount)
    (with-read quotes sale-id { 'id:= qtoken, 'spec:= spec:object{quote-spec} }
      (enforce (= qtoken (at 'id token)) "incorrect sale token")
      (bind spec
        {'price := price:decimal
        , 'recipient := recipient:string
        , 'designated-buyer-guard := designated-buyer-guard:guard
        , 'designated-buyer := designated-buyer:string
        , 'renter-subsidy := renter-subsidy:decimal
        , 'rent-interval := rent-interval:decimal
        }
        (if (enforce-designated-buyer designated-buyer designated-buyer-guard)
          (enforce-guard designated-buyer-guard)
          true
        )
        ;;Calculate how much they need to pay to netflix each
        (let* (
          (provider-royalty:decimal (at 'provider-royalty (get-policy token)))
          (provider-account:string (at 'provider-account (get-policy token)))
          (seller-to-provider:decimal (* provider-royalty renter-subsidy))
          (buyer-to-provider:decimal (-  provider-royalty seller-to-provider))
        )
        (coin.transfer buyer provider-account buyer-to-provider)
        (if (< 0.0 seller-to-provider) (coin.transfer seller provider-account seller-to-provider) true)
        (if (< 0.0 (* amount price)) (coin.transfer buyer recipient (* amount price)) true)
        

        ;;Update rent-start and rent-end
        (bind (chain-data){'block-time := current-time}
          (let*  ((rent-end:time (add-time current-time rent-interval)))
           (update policies (at 'id token) { "rent-start-time" : current-time, "rent-end-time" : rent-end, "renter-guard":buyer-guard })
           ;;Fire RENT START EVENT
           (emit-event (RENT_START token buyer-guard current-time rent-end))
          ) 
        )
      )
    ))
    true
  )

  (defun enforce-crosschain:bool
    ( token:object{token-info}
      sender:string
      guard:guard
      receiver:string
      target-chain:string
      amount:decimal )
    (enforce-ledger)
    (enforce false "Transfer prohibited")
  )

    (defun enforce-burn:bool
    ( token:object{token-info}
      account:string
      amount:decimal
    )
    (enforce-ledger)
    (enforce false "Burn prohibited")
  )

)

(create-table quotes)
(create-table policies)