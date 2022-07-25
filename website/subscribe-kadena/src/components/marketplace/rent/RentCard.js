import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../Button.js";
import "./RentMarketplaceStyles.css";

function CompanyCard(props) {
  return (
    <>
      <li className="rent_card_item">
        <div className="company_cards_item_link" >
          <figure className="rent_pic-wrap" data-category={props.label}>
            <img
              className="company_cards_item_img"
              src={props.src}
              alt="Provider Image"
            />
          </figure>
          <div className="token_info_wrapper">
            <div className="purchase_details_wrapper">
              <div className="company_name">{props.company_name}</div>
              <div className="rent_price">Price: {props.price}</div>
              <div className="rent_time">Period: {props.time}</div>
            </div>
            <div className="renter_name_wrapper">
              <div className="renter_name">{props.renter_name}</div>
              <div className="withdraw_button_wrapper">
                <button type="button" id="withdraw" className="withdraw_button">
                  Withdraw Token
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>
    </>
  );
}

export default CompanyCard;
