import React from "react";
import { Link } from "react-router-dom";
import "./ViewSubscriptions.css";

function SubscriptionCard(cardVals) {
  return (
    <>
      <div className="circle">
        <p className="text">{cardVals.text}</p>
      </div>
    </>
  );
}

export default SubscriptionCard;
