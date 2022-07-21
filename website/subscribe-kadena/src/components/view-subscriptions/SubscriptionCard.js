import React from "react";
import { Link } from "react-router-dom";
import "./ViewSubscriptions.css";

function SubscriptionCard({ token }) {
  const { text1, text2 } = token;
  return (
    <>
      <div className="circle">
        <p className="text">{text1}</p>
        <p className="text">{text2}</p>
      </div>
    </>
  );
}

export default SubscriptionCard;
