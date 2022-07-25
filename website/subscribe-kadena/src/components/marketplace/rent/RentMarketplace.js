import React, { useEffect, useState } from "react";
import "./RentMarketplaceStyles.css";
import RentCard from "./RentCard";

// image imports
import NetflixImage from "../../images/netflix-image.png";
import AmazonImage from "../../images/amazon-image.png";
import DisneyImage from "../../images/disney-image.png";
import LionImage from "../../images/lion-image.jpg";
import KamsImage from "../../images/kams-image.jpg";
import JoesImage from "../../images/joes-image.jpg";
import axios from "axios";

function RentMarketplace() {
  const [tokens, setTokens] = useState([])
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_SUBSCRIPTION_API}/token/get`,{
      params:{
        listed:true
      }
    }).then(res=>{
      setTokens(res.data.payload.tokens)
      console.log(res.data.payload.tokens)
    })
  },[])
  return (
    <div className="rent_page">
      <h1 className="rent-header">Renting Marketplace</h1>
      <div className="rent_cards_container">
        <div className="rent_cards_wrapper">
          <ul className="rent_cards_items">
          {
              tokens.map((token)=>{
                return(<RentCard 
                  src = {NetflixImage} 
                  company_name = {token.token_id}
                  price = {`${token.rent_price} KDA`}
                  time = {`${token.rent_interval/86400} Days`}
                  label="Entertainment"
                  renter_name="Manas"
                   />)
              })
            }
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RentMarketplace;
