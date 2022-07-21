import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../Button.js";

function CompanyCard(props) {
  return (
    <>
      <li className="company_cards_item">
        <Link className="company_cards_item_link" to={props.path}>
          <figure
            className="company_cards_item_pic-wrap"
            data-category={props.label}
          >
            <img
              className="company_cards_item_img"
              src={props.src}
              alt="Provider Image"
            />
          </figure>
          <div className="company_cards_provider_info_wrapper">
            <div className="company_cards_sale_info_wrapper">
              <div className="company_cards_price">Price: {props.price}</div>
              <div className="company_cards_recur">Period: {props.period}</div>
            </div>

            <div className="company_cards_name_wrapper">{props.name}</div>

            <div className="company_cards_buttons_wrapper">
              <Button
                className="buy_button_style"
                buttonStyle="btn--market"
                buttonSize="btn--market-size"
              >
                SIGN UP
              </Button>
            </div>
          </div>
        </Link>
      </li>
    </>
  );
}

export default CompanyCard;
