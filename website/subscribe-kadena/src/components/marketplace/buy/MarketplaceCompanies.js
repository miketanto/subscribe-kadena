import React, {useState, useEffect, useContext} from "react";
import "./MarketplaceStyles.css";
import CompanyCard from "./CompanyCard";
import { subscribeToken } from "./subscribeFunction";
import { WalletContext } from "../../context/WalletContext";
import axios from 'axios'

// image imports
import NetflixImage from "../../images/netflix-image.png";
import Loader from "../../Loader";
import { Link } from "react-router-dom";


function MarketplaceCompanies() {
  const [subscriptions, setSubscriptions] = useState([])
  const [selectedSub, setSelectedSub] = useState()
  const [loading, setLoading] = useState(false)
  const [loadingModal, showLoadingModal] = useState(false)
  const [subscriptionReqKey, setSubscriptionReqKey] = useState("")
  const {wallet} = useContext(WalletContext)
  const [formInput, updateFormInput] = useState({
    owner:"",
    owner_guard:"",
    data:{
      "assetUrl": "https://www.netflix.com",
      "creationDate": "2022-07-11",
      "title": "Mike's Netflix Subscription",
      "providerName": "Netflix Co.ltd"
    }
  })
  //Refactor to custom useSubscriptions hook
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_SUBSCRIPTION_API}/subscription/get`).then(res=>{
      setSubscriptions(res.data.payload.subscriptions)
      console.log(res.data.payload.subscriptions)
    })
  },[])
  return (
    <div className="subscription_cards_page">
      <h1 className="subscription-header">Subscription Token Marketplace</h1>
      <div className="company_cards_container">
        <div className="company_cards_wrapper">
          {
              subscriptions.map((subscription)=>{
                return(<CompanyCard 
                  src = {NetflixImage} 
                  name = {subscription.name}
                  price = {`${subscription.price} KDA`}
                  period = {`${subscription.interval/86400} Days`}
                  label="Entertainment"
                  onClick = {()=>setSelectedSub(subscription)}
                   />)
              })
            }
        </div>
      </div>
      {selectedSub && 
      (<div className="checkout">
      <div className="maincheckout">
        <button
          className="btn-close"
          onClick={() => setSelectedSub(null)}
        >
          x
        </button>
        <div className="heading">
          <h3>Checkout</h3>
        </div>
        <p>
          You are about to purchase a{" "}
          <span className="bold">
            {selectedSub.name}
          </span>
          <span className="bold"> {`From ${selectedSub.provider}`} </span>
        </p>
        <div className="detailcheckout mt-4">
          <div className="listcheckout">
            <h6>
              Owner
            </h6>
            <input
              type="text"
              name="buy_now_qty"
              id="buy_now_qty"
              className="form-control"
              placeholder={wallet == null ? "Owner Account" : wallet.account}
              onChange={(e) =>
                updateFormInput({ ...formInput, owner: e.target.value })
              }
            />

            <h6>
              Owner Guard
            </h6>
            <input
              type="text"
              name="buy_now_qty"
              id="buy_now_qty"
              className="form-control"
              placeholder="Owner Guard"
              onChange = {(e)=>updateFormInput({...formInput, owner_guard : e.target.value})}
            />

            <h6>
              Owner Private Key
            </h6>
            <input
              type="text"
              name="buy_now_qty"
              id="buy_now_qty"
              className="form-control"
              placeholder="Owner Guard"
              onChange = {(e)=>updateFormInput({...formInput, buyerPrivKey : e.target.value})}
            />

            <h6>
              Provider Private Key
            </h6>
            <input
              type="text"
              name="buy_now_qty"
              id="buy_now_qty"
              className="form-control"
              placeholder="Owner Guard"
              onChange = {(e)=>updateFormInput({...formInput, providerPrivKey : e.target.value})}
            />
          </div>
        </div>
        <div className="heading">
          <p>You will pay</p>
          <div className="subtotal">{`${selectedSub.price} KDA`}</div>
        </div>
        <button
          className="btn-main lead mb-5"
          onClick={() => {
            const parsedOwnerGuard = {
              "keys":[formInput.owner_guard],
              "pred":"keys-all"
            }
            showLoadingModal(true)
            setLoading(true)
            subscribeToken({...formInput,owner_guard:parsedOwnerGuard,subscription:selectedSub})
            .then(res=>{
              console.log(res)
              setSubscriptionReqKey(res)
              setLoading(false)
            })}
          }
        >
          Checkout
        </button>
      </div>
    </div>)}
    {
      loadingModal&&(<Loader loading = {loading} showLoadingModal = {showLoadingModal}
      loadingMessage = {"Subscribing..."} finishedMessage = {<a href={`https://explorer.chainweb.com/testnet/tx/${subscriptionReqKey}`}>View Transaction</a>}
      />)
    }
    </div>
  );
}

export default MarketplaceCompanies;
