import React from "react";
import "./MarketplaceStyles.css";
import CompanyCard from "./CompanyCard";

// image imports
import NetflixImage from "../images/netflix-image.png";
import AmazonImage from "../images/amazon-image.png";
import DisneyImage from "../images/disney-image.png";
import LionImage from "../images/lion-image.jpg";
import KamsImage from "../images/kams-image.jpg";
import JoesImage from "../images/joes-image.jpg";

function Cards() {
  return (
    <div className="subscription_cards_page">
      <h1 className="subscription-header">Subscription Token Marketplace</h1>
      <div className="company_cards_container">
        <div className="company_cards_wrapper">
          <ul className="company_cards_items">
            <CompanyCard
              src={NetflixImage}
              text="Netflix"
              label="Entertainment"
              path="/services"
            />
            <CompanyCard
              src={AmazonImage}
              text="Amazon"
              label="Sale"
              path="/services"
            />
            <CompanyCard
              src={DisneyImage}
              text="Disney+"
              label="Entertainment"
              path="/services"
            />
          </ul>
          <ul className="cards__items">
            <CompanyCard
              src={JoesImage}
              text="Joes"
              label="Hydration"
              path="/products"
            />
            <CompanyCard
              src={LionImage}
              text="Lion"
              label="Hydration"
              path="/products"
            />
            <CompanyCard
              src={KamsImage}
              text="Kams"
              label="Hydration"
              path="/sign-up"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
