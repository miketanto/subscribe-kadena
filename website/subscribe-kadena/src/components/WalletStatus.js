import React from 'react'
import {useState, useEffect,useContext} from 'react';
import { WalletContext } from './context/WalletContext';
import './WalletStatus.css'


function WalletStatus() {
    const {wallet, setWallet} = useContext(WalletContext)
    const [formInput, updateFormInput] = useState({
        privKey:"",
        account:"",
        guard:""
    })
    const [openLogin, toggleLogin] = useState(false)
    const [openLogout, toggleLogout] = useState(false)

    useEffect(() => {
      console.log(wallet)
    }, [wallet])
    return (
        <div>
            {wallet == null ? 
            (<div  onClick= {()=>toggleLogin(true)} className = "connect">
                  Connect Wallet
            </div>):
                <div onClick = {()=>toggleLogout(true)} className = "connected">
                    Wallet Connected
                </div>
            }
            {openLogin && 
      (<div className="checkout">
      <div className="maincheckout">
        <button
          className="btn-close"
          onClick={() => toggleLogin(false)}
        >
          x
        </button>
        <div className="heading">
          <h3>Connect Wallet</h3>
        </div>
        <div className="detailcheckout mt-4">
          <div className="listcheckout">
            <h6>
              Account
            </h6>
            <input
              type="text"
              name="buy_now_qty"
              id="buy_now_qty"
              className="form-control"
              onChange={(e) =>
                updateFormInput({ ...formInput, account: e.target.value })
              }
            />

            <h6>
              Account Guard
            </h6>
            <input
              type="text"
              name="buy_now_qty"
              id="buy_now_qty"
              className="form-control"
              onChange = {(e)=>updateFormInput({...formInput, guard : e.target.value})}
            />

            <h6>
              Secret Key
            </h6>
            <input
              type="text"
              name="buy_now_qty"
              id="buy_now_qty"
              className="form-control"
              onChange={(e) =>
                updateFormInput({ ...formInput, privKey: e.target.value })
              }
            />
          </div>
        </div>
        <button
          className="btn-main lead mb-5"
          onClick={() => {
            const parsedGuard = JSON.parse(formInput.guard)
            setWallet({...formInput, guard:parsedGuard})
            toggleLogin(false)
            }
          }
        >
          Connect
        </button>
      </div>
    </div>)}

    {openLogout && 
      (<div className="checkout">
      <div className="maincheckout">
        <button
          className="btn-close"
          onClick={() => toggleLogout(false)}
        >
          x
        </button>
        <div className="heading">
          <h3>Logout</h3>
        </div>
        <button
          className="btn-main lead mb-5"
          onClick={() => {
            setWallet(null)
            toggleLogout(false)
            }
          }
        >
          Disconnect
        </button>
      </div>
    </div>)}
        </div>
        
        
    )
}

export default WalletStatus