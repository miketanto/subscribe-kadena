(namespace "free")

(module transferable-subscribe-policy GOVERNANCE

  @doc "Policy for non-transferable subscriber protocol"

  (defcap GOVERNANCE ()
    ;; Enforces keyset that could update policy
    (enforce-guard (keyset-ref-guard 'marmalade-admin )))

  ;;Token Policy Standard Interface
  ;; Enforce init, mint, sale, offer, buy, transfer, burn
  (implements kip.token-policy-v1)
  (use kip.token-policy-v1 [token-info])



  ;;Schema for subscription policy table
  ;;Data that will vary from policy to policy
  (defschema policy-schema
    provider-guard:guard
    owner-guard:guard
    renter-guard:guard
    provider-royalty:decimal
    owner-royalty:decimal
    trial-period:time
    grace-period:time
    pausable:bool
    interval:time
    expiry-time:time
    first-start-time:time
    min-supply:decimal
    max-suppy:decimal
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
    ( token:object{token-info}
    )
    (enforce-ledger)
    (enforce-protocol)
    (let* ( (provider-guard:guard (read-keyset 'provider-guard ))
            (owner-guard:guard (read-keyset 'owner-guard ))
            (renter-guard:guard (read-keyset 'renter-guard ))
            (provider-royalty:decimal (read-decimal 'provider-royalty ))
            (owner-royalty:decimal (read-decimal 'owner-royalty ))
            (trial-period:time (read-time 'trial-period ))
            (grace-period:time (read-time 'grace-period ))
            (pausable:bool (read-bool 'pausable ))
            (expiry-time:time (read-time 'expiry-time ))
            (interval:time (read-time 'interval ))
            (first-start-time:time (read-time 'first-start-time ))
            (min-supply:decimal (read-decimal 'min-supply ))
            (max-supply:decimal (read-decimal 'max-supply ))
            )
    (enforce (>= min-amount 0.0) "Invalid min-amount")
    (enforce (>= max-supply 0.0) "Invalid max-supply")
    (insert policies (at 'id token)
      { 'provider-guard: provider-guard
      ,'owner-guard: owner-guard
      ,'renter-guard: renter-guard
      ,'provider-royalty: provider-royalty
      ,'owner-royalty: owner-royalty
      ,'trial-period: trial-period
      ,'grace-period: grace-period
      ,'pausable: pausable
      ,'expiry-time : expiry-time
      ,'interval : interval
      ,'first-start-time : first-start-time
      , 'max-supply: max-supply
      , 'min-amount: min-amount })
    true)
  )

  ;;Only subscription module can mint
  ;;Mint Guard is the subscription module
  (defun enforce-mint:bool
    ( token:object{token-info}
      account:string
      guard:guard
      amount:decimal
    )
    (enforce-ledger)
    (enforce-protocol)
    (bind (get-policy token)
      { 'owner-guard:=owner-guard:guard
      , 'min-amount:=min-amount:decimal
      , 'max-supply:=max-supply:decimal
      }
      ;;Enforce that the person has enough money in the vault: TODO
      ;;Move money from consumer vault to provider vault ()
      (enforce (>= amount min-amount) "mint amount < min-amount")
      (enforce (<= (+ amount (at 'supply token)) max-supply) "Exceeds max supply")
  ))

  ;;Types of Transfers
  ;; On resubscribe - the protocol has a pact that 
  ;;    1. Consumer signs and transfers to the protocol(RETURN)
  ;;    2. Consumer gets charged in the vault
  ;;    2. Protocol transfers back while changing expiry(EXTEND)
  ;;    Note: the transfer back to the owner is called the EXTEND Capability
  ;; 1.RETURN -- Need to know that it is past expiry
  ;; 2.EXTEND -- Transfer back to owner if he resubscribes
  ;; 3.LEND -- Transfer to friend (with return pact)--TODO
  ;; 4.TRIAL-REFUND -- Transfer back to protocol for a refund--TODO
  (defcap RETURN (token:object{token-info} receiver-guard:guard)
      @managed
      (bind (get-policy token)
      { 'owner-guard:=owner-guard:guard 
        ,'expiry-time := expiry-time:time
      }
      (enforce-guard owner-guard)
      (enforce (= receiver-guard (keyset-ref-guard 'protocol-keyset )) "Only could return to protocol")
      (bind (chain-data){ 'block-time := current-time}
        (enforce (> (time current-time) expiry-time) "Subscription not yet expired")
      )
      
    )
  )

  (defcap EXTEND (token:object{token-info} receiver-guard:guard pact-id:string)
    @managed ;; one-shot for a given amount
    (bind (get-policy token)
      { 'owner-guard:=owner-guard:guard }
      ;;Only protocol account can extend
      (enforce-extension-pact pact-id)
      (enforce-protocol)
      (enforce (= owner-guard receiver-guard) "Only can extend to bound consumer")
      (compose-capability UPDATE_EXPIRY)
  ))

  (defcap UPDATE_EXPIRY ()
  "private cap for update-expiry"
  true)

  (defun update-expiration (token:object{token-info})
    (require-capability UPDATE_EXPIRY)
    (bind (get-policy token) {
      'expiry-time := old-expiry-time
      ,'interval := interval
      }
      (update policies (at 'id token) { "expiry-time": (+ old-expiry-time interval)})
    )
  )

  (defun enforce-transfer:bool
    ( token:object{token-info}
      sender:string
      guard:guard
      receiver:string
      amount:decimal )
    (enforce-ledger)
    (with-capability (RETURN token guard)
      ;;For the RETURN transfer part of the pact
      true
    )
    (with-capability (EXTEND token guard (read-msg 'pact-id ))
        ;;Update expiration date has been confirmed that the sender is the protocol
        (update-expiration token)
    )
    (with-capability ()
      
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
    (enforce-sale-pact sale-id)
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
    (enforce-sale-pact sale-id)
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