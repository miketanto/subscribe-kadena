import React from "react";
import "../../App.css";
import CardItem from "./SubscriptionCard";
import "./ViewSubscriptions.css";

function ViewSubscriptions() {
  return (
    <div className="subscription-cards">
      <h1>Your Subscriptions:</h1>
      <div className="container">
        <div className="wrapper">
          <ul className="items">
            <CardItem text="Netflix" />
            <CardItem text="Amazon" />
            <CardItem text="Disney+" />
          </ul>
          <ul className="items">
            <CardItem text="Hulu" />
            <CardItem text="Costco" />
            <CardItem text="Kams" />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ViewSubscriptions;
