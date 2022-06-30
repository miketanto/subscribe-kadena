(module subscribe-vault GOVERNANCE
    @doc "Policy for transferable subscriber protocol"

    (use kip.poly-fungible-v2 [sender-balance-change receiver-balance-change])
    
  (defcap GOVERNANCE ()
    ;; Enforces keyset that could update policy
    (enforce-guard (keyset-ref-guard 'subscribe-vault-admin )))

    (defschema account-details-fungible
        @doc
          " Account details: fungible token, account name, balance, and guard."
        @model
          [ (invariant (!= fungible ""))
            (invariant (!= account ""))
            (invariant (>= balance 0.0))
          ]
        fungible:module{fungible-v2}
        account:string
        balance:decimal
        guard:guard)

    (deftable ledger:{account-details-fungible})

    (defun key:string ( id:string account:string )
        @doc "DB key for ledger account"
        (format "{}:{}" [id account])
    )

    (defcap TRANSFER:bool
        ( id:string
          sender:string
          receiver:string
          amount:decimal
        )
        @managed amount TRANSFER-mgr
        (enforce (> amount 0.0) "Amount must be positive")
        (compose-capability (DEBIT id sender))
        (compose-capability (CREDIT id receiver))
      )

      (defun TRANSFER-mgr:decimal
        ( managed:decimal
          requested:decimal
        )
        (let ((newbal (- managed requested)))
          (enforce (>= newbal 0.0) (format "TRANSFER exceeded for balance {}" [managed]))
          ;;Returns new balance value
          newbal)
      )
    
      (defcap SUPPLY:bool (id:string supply:decimal)
        @doc " Emitted when supply is updated, if supported."
        @event true
      )
    
      (defcap RECONCILE:bool
        ( token-id:string
          amount:decimal
          sender:object{sender-balance-change}
          receiver:object{receiver-balance-change}
        )
        @doc " For accounting via events. \
             \ sender = {account: '', previous: 0.0, current: 0.0} for mint \
             \ receiver = {account: '', previous: 0.0, current: 0.0} for burn"
        @event
        true
      )
    
      (defcap ACCOUNT_GUARD:bool (id:string account:string guard:guard)
        @doc " Emitted when ACCOUNT guard is updated."
        @event
        true
      )
    
      ;;
      ;; Implementation caps
      ;;

      (defcap ROTATE (id:string account:string)
        @doc "Autonomously managed capability for guard rotation"
        @managed
        true)
    
      (defcap DEBIT (id:string sender:string)
        (enforce-guard (account-guard id sender))
      )
    
      (defun account-guard:guard (id:string account:string)
        (with-read ledger (key id account) { 'guard := g } g)
      )
    
      (defcap CREDIT (id:string receiver:string) true)
    
      (defcap UPDATE_SUPPLY ()
        "private cap for update-supply"
        true)

        (defun rotate:bool (id:string account:string new-guard:guard)
        true
        )
    ;;Create Vault Treasury Account
    (defconst VAULT_TREASURY 'subscribe-vault-treasury )   
    (defun create-vault-treasury-guard:guard ()
        (create-user-guard (vault-treasury-guard))
      )
    
      (defun vault-treasury-guard ()
        ;;TBD what is needed in this
        true
      )
    
      (defun init ()
        (coin.create-account VAULT_TREASURY (create-vault-treasury-guard))
      )
    (defconst KDA_COIN_MODULE coin)
    (defun get-account (account:string fungible-id:string)
        (with-default-read ledger (key account fungible-id) { "balance": -1.0 } { "balance":= balance, "fungible":= fungible }
        balance)
    )        
    (defcap KDA_DEPOSIT (id:string receiver:string) true)
    (defun deposit (sender:string sender-guard:guard amount:decimal)
        (with-capability (KDA_DEPOSIT "new" "thing")
            ;;Transfer first
            ;;Need to investigate if I could just use the fungible contract name instead of KDA
            (coin.transfer sender VAULT_TREASURY amount)
            (if (< (get-account sender "KDA") 0)
            ;;If no account yet
            (insert ledger (key sender "KDA") {"balance":amount, "account":sender, "guard":sender-guard, "fungible":KDA_COIN_MODULE})
            ;;Else
            (with-read ledger (key sender "KDA") {"balance":= old-balance}
                (update ledger (key sender "KDA") {"balance":(+ old-balance amount)})
            )
            )
    (format "Depositted {} KDA" [amount]))
    )
)