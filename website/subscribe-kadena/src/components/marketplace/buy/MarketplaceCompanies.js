import React from "react";
import "./MarketplaceStyles.css";
import CompanyCard from "./CompanyCard";

// image imports
import NetflixImage from "../../images/netflix-image.png";
import AmazonImage from "../../images/amazon-image.png";
import DisneyImage from "../../images/disney-image.png";
import LionImage from "../../images/lion-image.jpg";
import KamsImage from "../../images/kams-image.jpg";
import JoesImage from "../../images/joes-image.jpg";

/*

const data = [
  {
    //path: "/netflix",
    label: "Entertainment",
    src: { NetflixImage },
    price: "$10.00",
    period: "1 month",
    name: "Netflix",
  },
  {
    //path: "/amazon",
    label: "Retail",
    src: { AmazonImage },
    price: "$10.00",
    period: "1 month",
    name: "Amazon",
  },
  {
    // path: "/disney",
    label: "Entertainment",
    src: { DisneyImage },
    price: "$10.00",
    period: "1 month",
    name: "Disney",
  },
  {
    //path: "/joes",
    label: "Hydration",
    src: { JoesImage },
    price: "$10.00",
    period: "1 month",
    name: "Joe's",
  },
  {
    //path: "/lion",
    label: "Hydration",
    src: { LionImage },
    price: "$10.00",
    period: "1 month",
    name: "Lion",
  },
  {
    //path: "/kams",
    label: "Hydration",
    src: { KamsImage },
    price: "$10.00",
    period: "1 month",
    name: "Kams",
  },
];

*/

function MarketplaceCompanies() {
  return (
    <div className="subscription_cards_page">
      <h1 className="subscription-header">Subscription Token Marketplace</h1>
      <div className="company_cards_container">
        <div className="company_cards_wrapper">
          <ul className="company_cards_items">
            <CompanyCard
              src={NetflixImage}
              name="Netflix"
              label="Entertainment"
              path="/services"
              price="$10.00"
              period="1 month"
            />
            <CompanyCard
              src={AmazonImage}
              name="Amazon"
              label="Sale"
              path="/services"
              price="$10.00"
              period="1 month"
            />
            <CompanyCard
              src={DisneyImage}
              name="Disney+"
              label="Entertainment"
              path="/services"
              price="$10.00"
              period="1 month"
            />
          </ul>
          <ul className="cards__items">
            <CompanyCard
              src={JoesImage}
              name="Joes"
              label="Hydration"
              path="/products"
              price="$10.00"
              period="1 month"
            />
            <CompanyCard
              src={LionImage}
              name="Lion"
              label="Hydration"
              path="/products"
              price="$10.00"
              period="1 month"
            />
            <CompanyCard
              src={KamsImage}
              name="Kams"
              label="Hydration"
              path="/sign-up"
              price="$10.00"
              period="1 month"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MarketplaceCompanies;
