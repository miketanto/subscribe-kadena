import React from "react";
import "./RentMarketplaceStyles.css";
import RentCard from "./RentCard";

// image imports
import NetflixImage from "../../images/netflix-image.png";
import AmazonImage from "../../images/amazon-image.png";
import DisneyImage from "../../images/disney-image.png";
import LionImage from "../../images/lion-image.jpg";
import KamsImage from "../../images/kams-image.jpg";
import JoesImage from "../../images/joes-image.jpg";

function RentMarketplace() {
  return (
    <div className="rent_page">
      <h1 className="rent-header">Renting Marketplace</h1>
      <div className="rent_cards_container">
        <div className="rent_cards_wrapper">
          <ul className="rent_cards_items">
            <RentCard
              path="/services"
              label="Entertainment"
              src={NetflixImage}
              company_name="Netflix Gold"
              price="5 KDA"
              time="5 days"
              renter_name="Manas"
            />
            <RentCard
              path="/services"
              label="Entertainment"
              src={NetflixImage}
              company_name="Netflix Silver"
              price="3.2 KDA"
              time="2 days"
              renter_name="Mike"
            />
            <RentCard
              path="/services"
              label="Entertainment"
              src={NetflixImage}
              company_name="Disney+"
              price="23.5 KDA"
              time="1 month"
              renter_name="Stu"
            />
            <RentCard
              path="/services"
              label="Entertainment"
              src={NetflixImage}
              company_name="Joe's"
              price="1000000 KDA"
              time="2 days"
              renter_name="Jacquin"
            />
            <RentCard
              path="/services"
              label="Entertainment"
              src={NetflixImage}
              company_name="Kams"
              price="1.4 KDA"
              time="2 days"
              renter_name="Capybara"
            />
            <RentCard
              path="/services"
              label="Kadena"
              src={NetflixImage}
              company_name="Netflix"
              price="13.3 KDA"
              time="25 days"
              renter_name="Joel"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RentMarketplace;
