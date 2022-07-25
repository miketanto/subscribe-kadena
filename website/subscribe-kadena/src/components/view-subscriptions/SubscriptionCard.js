import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { withdrawToken } from "../../Marmalade/api/tokenFunctions";
import "./ViewSubscriptions.css";

function SubscriptionCard({token, onClick}) {
  const {token_id, expiry_time} = token
  useEffect(()=>{
    console.log(token)
  },[])
  return (
    <>
      <div className="circle" onClick = {onClick}>
        <p className="text">{token_id}</p>
        <p className="text">{expiry_time}</p>
      </div>
    </>
  );
}

export default SubscriptionCard;
