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
    provider-guard:guard
    owner-guard:guard
    renter-guard:guard
    provider-royalty:decimal
    owner-royalty:decimal
    trial-period:time
    grace-period:time
    pausable:string
    interval:time
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
  
   (defun enforce-extension-pact:bool (extension-id:string)
    "Enforces that SALE is id for currently executing pact"
    (enforce (= extension-id (pact-id)) "Invalid pact/extension id")
   )

   (defun enforce-init:bool
    ( token:object{token-info})

    (enforce-ledger)
    ;;(enforce-guard (read-keyset 'provider-guard ))

    (let* ( (provider-guard:guard (read-keyset 'provider-guard ))
            (owner-guard:guard (read-keyset 'owner-guard ))
            (renter-guard:guard (read-keyset 'renter-guard ))
            (provider-royalty:decimal (read-decimal 'provider-royalty ))
            (owner-royalty:decimal (read-decimal 'owner-royalty ))
            (trial-period:time (time (read-string 'trial-period )))
            (grace-period:time (time (read-string 'grace-period )))
            (pausable:string (read-msg 'pausable ))
            (expiry-time:time (time (read-string 'expiry-time )))
            (interval:time (time (read-string 'interval )))
            (first-start-time:time (time (read-string 'first-start-time )))
            (rent-start-time:time (time "0000-00-00T00:00:00Z"))
            (rent-end-time:time (time "0000-00-00T00:00:00Z"))
            (min-amount:decimal (read-decimal 'min-amount ))
            (max-supply:decimal (read-decimal 'max-supply ))
            )
    (enforce (>= min-amount 0.0) "Invalid min-amount")
    (enforce (>= max-supply 0.0) "Invalid max-supply")

    (insert policies (at 'id token) 
    {"provider-guard":provider-guard, 
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
    (bind (get-policy token)
    { 'owner-guard:=owner-guard:guard
    , 'provider-guard := provider-guard:guard
    , 'min-amount:=min-amount:decimal
    , 'max-supply:=max-supply:decimal
    }
    ;;Only designated owner could mint
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
))

  ;;Types of Transfers
  ;; A.Expiry Transfers
  ;;    1.WITHDRAW -- Need to know that it is past expiry
  ;;    2.EXTEND -- Transfer back to owner if he resubscribes
  ;; B. Lending Transfers
  ;;    1.LEND_WITHDRAW --
  ;;
  (defcap EXTEND (token:object{token-info} extender-account:string)
     @managed
    ;(bind (get-policy token)
      ;{ 'owner-guard:=owner-guard:guard
        ;'provider-guard:=provider-guard:guard}
      ;;Only owner can extend
      ;;(enforce-guard provider-guard)
      ;(let* 
        ;((extender-guard:guard (at 'guard (coin.details extender-account))))
        ;(enforce (= extender-guard owner-guard))
      ;))
      (compose-capability (UPDATE_EXPIRY))
  )

  (defcap UPDATE_EXPIRY()
  "private cap for update-expiry"
  true)

  (defcap REGULAR ()
  @managed
  true
  )

  (defun update-expiration (token:object{token-info})
    (require-capability (UPDATE_EXPIRY))
    (bind (get-policy token) {"expiry-time":= old-expiry-time, "interval":= interval}
      (update policies (at 'id token) { "expiry-time" : old-expiry-time })
    )
  )

  (defun enforce-transfer:bool
    ( token:object{token-info}
      sender:string
      guard:guard
      receiver:string
      amount:decimal )
    (enforce-ledger)
   ;; (with-capability (RETURN token guard)
      ;;For the RETURN transfer part of the pact
    ;;  true
    ;;)
    ;(with-capability (REGULAR)
        ;(bind (get-policy token)
          ;{ 'owner-guard:=owner-guard:guard}
          ;;Only owner can extend
          ;;(enforce-guard provider-guard)
         ;(enforce-guard owner-guard)
      ;)
    ;)
    (with-capability (EXTEND token (read-msg 'extender-account ))
        ;;Update expiration date has been confirmed that the sender is the protocol
        ;;See if there is enough funds in the buyer account
        ;;Transfer funds to the provider account
      (let* 
        ((token-extend-price:decimal (read-decimal 'token-extend-price ))
        (extender-account:string (read-msg 'extender-account )))
      (coin.transfer extender-account sender token-extend-price))
      (update-expiration token)
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

  (defschema quote-spec
    @doc "Quote data to include in payload"
    fungible:module{fungible-v2}
    price:decimal
    recipient:string
    recipient-guard:guard
  )

  (defschema quote-schema
    id:string
    spec:object{quote-spec})

  (deftable quotes:{quote-schema})

  (defun enforce-offer:bool
    ( token:object{token-info}
      seller:string
      amount:decimal
      sale-id:string
    )
    @doc "Capture quote spec for SALE of TOKEN from message"
    (enforce-ledger)
    (enforce-extension-pact sale-id)
    (let* ( (spec:object{quote-spec} (read-msg QUOTE-MSG-KEY))
            (fungible:module{fungible-v2} (at 'fungible spec) )
            (price:decimal (at 'price spec))
            (recipient:string (at 'recipient spec))
            (recipient-guard:guard (at 'recipient-guard spec))
            (recipient-details:object (fungible::details recipient))
            (sale-price:decimal (* amount price)) )
      (fungible::enforce-unit sale-price)
      (enforce (< 0.0 price) "Offer price must be positive")
      (enforce (=
        (at 'guard recipient-details) recipient-guard)
        "Recipient guard does not match")
      (insert quotes sale-id { 'id: (at 'id token), 'spec: spec })
      (emit-event (QUOTE sale-id (at 'id token) amount price sale-price spec)))
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
    (enforce-extension-pact sale-id)
    (with-read quotes sale-id { 'id:= qtoken, 'spec:= spec:object{quote-spec} }
      (enforce (= qtoken (at 'id token)) "incorrect sale token")
      (bind spec
        { 'fungible := fungible:module{fungible-v2}
        , 'price := price:decimal
        , 'recipient := recipient:string
        }
        (fungible::transfer buyer recipient (* amount price))
      )
    )
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