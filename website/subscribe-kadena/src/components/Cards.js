import React from "react";
import "./Cards.css";
import CardItem from "./CardItem";

function Cards() {
  return (
    <div className="cards">
      <h1>Check out some projects that use Kadena's Subscription Protocol!</h1>
      <div className="cards__container">
        <div className="cards__wrapper">
          <ul className="cards__items">
            <CardItem
              src="../../public/images/img-9.jpg"
              text="Project 1"
              label="Subscription"
              path="/services"
            />
            <CardItem
              src="../../public/images/img-2.jpg"
              text="Project 2"
              label="Subscription"
              path="/services"
            />
          </ul>
          <ul className="cards__items">
            <CardItem
              src="../../public/images/img-3.jpg"
              text="Project 3"
              label="DeFi"
              path="/services"
            />
            <CardItem
              src="../../public/images/img-4.jpg"
              text="Project 4"
              label="NFTs"
              path="/products"
            />
            <CardItem
              src="../../public/images/img-8.jpg"
              text="Project 5"
              label="NFTs"
              path="/sign-up"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
