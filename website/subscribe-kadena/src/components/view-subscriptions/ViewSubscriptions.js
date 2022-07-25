import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../App.css";
import CardItem from "./SubscriptionCard";
import "./ViewSubscriptions.css";

const data = [
  { name: "Netflix", expiry: "1 month" },
  { name: "Disney+", expiry: "1 month" },
  { name: "Hulu", expiry: "1 month" },
  { name: "Joes", expiry: "1 month" },
  { name: "Kams", expiry: "1 month" },
  { name: "Lion", expiry: "1 month" },
];

function ViewSubscriptions() {
  const [tokens, setTokens] = useState([]);
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
          <CardItem
            name="2023 Chevrolet Corvette Stingray"
            expiry="36 months"
          />
          <CardItem name="2022 Ferrari SF90 Coupe" expiry="60 months" />
          <CardItem name="2021 Tesla Model 3" expiry="24 months" />
          <CardItem name="2022 Audi R8" expiry="36 months" />
          <CardItem name="2022 Porsche 911 Carrera GTS" expiry="72 months" />
          <CardItem name="2022 Rolls-Royce Phantom" expiry="48 months" />
        </div>
      </div>
    </div>
  );
}

export default ViewSubscriptions;
