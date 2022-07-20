import React, {useEffect, useState} from "react";
import axios from "axios";
import "./MarketplaceStyles.css";
import CompanyCard from "./CompanyCard";

// image imports
import NetflixImage from "../images/netflix-image.png";
import AmazonImage from "../images/amazon-image.png";
import DisneyImage from "../images/disney-image.png";
import LionImage from "../images/lion-image.jpg";
import KamsImage from "../images/kams-image.jpg";
import JoesImage from "../images/joes-image.jpg";
import { subscribeToken } from "./subscribeFunction";


function Cards() {
 const [subscriptions, setSubscriptions] = useState([])
 const [selectedSub, setSelectedSub] = useState()
 const [formInput, updateFormInput] = useState({
  owner:"",
  owner_guard:"",
  data:""
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
          <ul className="company_cards_items">
            {
              subscriptions.map((subscription)=>{
                return(<CompanyCard 
                  src = {NetflixImage} 
                  text = {subscription.name}
                  label="Entertainment"
                  onClick = {()=>setSelectedSub(subscription)}
                   />)
              })
            }
          </ul>
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
              onChange = {(e)=>updateFormInput({...formInput, owner_guard : e.target.value})}
            />

            <h6>
              Data
            </h6>
            <input
              type="text"
              name="buy_now_qty"
              id="buy_now_qty"
              className="form-control"
              onChange={(e) =>
                updateFormInput({ ...formInput, data: e.target.value })
              }
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
            const parsedData = JSON.parse(formInput.data)
            const parsedOwnerGuard = JSON.parse(formInput.owner_guard)
            subscribeToken({...formInput,owner_guard:parsedOwnerGuard, data:parsedData,subscription:selectedSub})
            .then(res=>console.log(res))}
          }
        >
          Checkout
        </button>
      </div>
    </div>)}
    </div>
  );
}

export default Cards;
