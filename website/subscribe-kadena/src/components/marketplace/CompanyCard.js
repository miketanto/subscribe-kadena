import React from "react";
import { Link } from "react-router-dom";

function CompanyCard(props) {
  return (
    <>
      <li className="company_cards_item" onClick={props.onClick}>
        <div className="company_cards_item_link" >
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
          <div className="company_cards_provider_name">
            <h5 className="company_cards_text">{props.text}</h5>
          </div>
        </div>
      </li>
    </>
  );
}

export default CompanyCard;
