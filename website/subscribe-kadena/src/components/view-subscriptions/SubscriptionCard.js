import React, { useState } from "react";
import { Link } from "react-router-dom";
import { withdrawToken } from "../../Marmalade/api/tokenFunctions";
import "./ViewSubscriptions.css";

function SubscriptionCard(props) {
  return (
    <>
      <div className="token_container" onClick={props.onClick}>
        <div className="subscription_name">{props.name}</div>
        <div className="circle"></div>
        <div className="subscription_expiry">Valid for {props.expiry}</div>
      </div>
    </>
  );
}

export default SubscriptionCard;
