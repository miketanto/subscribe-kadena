import axios from "axios";
import React, {useEffect,useState} from "react";
import "../../App.css";
import CardItem from "./SubscriptionCard";
import "./ViewSubscriptions.css";

function ViewSubscriptions() {
  const [tokens, setTokens] = useState([])
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SUBSCRIPTION_API}/token/get`)
    .then((res)=>{
      console.log(res.data.payload.tokens)
      setTokens(res.data.payload.tokens)
    })
  }, [])
  
  return (
    <div className="subscription-cards">
      <h1>Your Subscriptions:</h1>
      <div className="container">
        <div className="wrapper">
          {
            tokens.map((token,key)=>{
              return(
                <CardItem token = {token} />
              )
            })
          }
        
        </div>
      </div>
    </div>
  );
}

export default ViewSubscriptions;
