import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../App.css";
import CardItem from "./SubscriptionCard";
import { offerRentToken } from "./listRental";
import "./WithdrawSubscription.css";
import Loader from "../Loader";
import { withdrawToken } from "../../Marmalade/api/tokenFunctions";

const data = [
  { name: "Netflix", expiry: "1 month" },
  { name: "Disney+", expiry: "1 month" },
  { name: "Hulu", expiry: "1 month" },
  { name: "Joes", expiry: "1 month" },
  { name: "Kams", expiry: "1 month" },
  { name: "Lion", expiry: "1 month" },
];

function WithdrawSubscription() {
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState()
  const [formInput, updateFormInput] = useState({
    provider_guard:"",
    providerPrivKey:"",
  })
  const [loading, setLoading] = useState(false)
  const [loadingModal, showLoadingModal] = useState(false)
  const [reqKey, setReqKey] = useState("")

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SUBSCRIPTION_API}/token/get`)
      .then((res) => {
        console.log(res.data.payload.tokens);
        setTokens(res.data.payload.tokens);
      });
  }, []);

  return (
    <div className="view_susbcriptions_page">
      <h1>Your Subscriptions</h1>
      <div className="subscriptions_container">
        <div className="subscriptions_wrapper">
          {/*{data.map((key, token) => (
            <CardItem token={token} />
          ))}*/}
          {tokens.map((token, key) => (
            <CardItem name={token.token_id} expiry = {token.expiry_time} onClick = {()=>setSelectedToken(token)} />
          ))}
        </div>
      </div>
      {selectedToken && 
      (<div className="checkout">
      <div className="maincheckout">
        <button
          className="btn-close"
          onClick={() => setSelectedToken(null)}
        >
          x
        </button>
        <div className="heading">
          <h3>Checkout</h3>
        </div>
        <p>
          You are about to withdraw a{" "}
          <span className="bold">
            {selectedToken.token_id}
          </span>
          <span className="bold"> {`to the renting market`} </span>
        </p>
        <div className="detailcheckout mt-4">
          <div className="listcheckout">
            <h6>
                Provider Guard
            </h6>
            <input
              type="text"
              name="buy_now_qty"
              id="buy_now_qty"
              className="form-control"
              placeholder="KDA"
              onChange = {(e)=>updateFormInput({...formInput, provider_guard : e.target.value})}
            />
            <h6>
                Provider Private Key
            </h6>
            <input
              type="text"
              name="buy_now_qty"
              id="buy_now_qty"
              className="form-control"
              placeholder="KDA"
              onChange = {(e)=>updateFormInput({...formInput, providerPrivKey : e.target.value})}
            />
          </div>
        </div>
        <button
          className="btn-main lead mb-5"
          onClick={() => {
            console.log("Rent")
            setLoading(true)
            showLoadingModal(true)
            const parsedGuard = {
                "keys":[formInput.provider_guard],
                "pred":"keys-all"
            }
            withdrawToken(selectedToken.rent_tx_raw_cmd,selectedToken.rent_withdrawal_sig,parsedGuard, formInput.providerPrivKey).then((res)=>{
              setReqKey(res)
              setLoading(false)
            })
          }}
        >
          Rent Out
        </button>
      </div>
    </div>)}
    {
      loadingModal&&(<Loader loading = {loading} showLoadingModal = {showLoadingModal}
      loadingMessage = {"Withdrawing Rental..."} finishedMessage = {<a href={`https://explorer.chainweb.com/testnet/tx/${reqKey}`}>View Transaction</a>}
      />)
    }
    </div>
  );
}

export default WithdrawSubscription;
