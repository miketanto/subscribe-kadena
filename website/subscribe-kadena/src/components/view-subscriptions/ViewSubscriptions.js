import React from "react";
import "../../App.css";
import CardItem from "./SubscriptionCard";
import "./ViewSubscriptions.css";
import StarfieldAnimation from "react-starfield-animation";

const data = [
  { text1: "Netflix" },
  { text1: "Disney+" },
  { text1: "Hulu" },
  { text1: "Joes" },
  { text1: "Kams" },
  { text1: "Lion" },
];

function ViewSubscriptions() {
  return (
    <div className="subscription-cards">
      <StarfieldAnimation
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        numParticles={500}
        particleSpeed={0}
        dx={0.00000000000000001} // x speed of stars in px/frame, default 0.05
        dy={0.00000000000000001}
      />
      <h1>Your Subscriptions:</h1>
      <div className="container">
        <div className="wrapper">
          {data.map((key, token) => (
            <CardItem token={token} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewSubscriptions;
