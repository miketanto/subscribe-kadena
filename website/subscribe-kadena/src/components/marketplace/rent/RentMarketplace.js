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
import { rentToken } from "./rentFunction";
import { parse } from "path";

function RentMarketplace() {
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState();
  const [formInput, updateFormInput] = useState({
    renter: "",
    renter_guard: "",
    renterPrivKey: "",
  });
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SUBSCRIPTION_API}/token/get`, {
        params: {
          listed: true,
        },
      })
      .then((res) => {
        setTokens(res.data.payload.tokens);
        console.log(res.data.payload.tokens);
      });
  }, []);
  return (
    <div className="rent_page">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>

      <h1 className="rent-header">Renting Marketplace</h1>
      <div className="rent_cards_container">
        <div className="rent_cards_wrapper">
          <ul className="rent_cards_items">
            {tokens.map((token) => {
              return (
                <RentCard
                  src={NetflixImage}
                  company_name={token.token_id}
                  price={`${token.rent_price} KDA`}
                  time={`${token.rent_interval / 86400} Days`}
                  label="Entertainment"
                  renter_name="Manas"
                  onClick={() => setSelectedToken(token)}
                />
              );
            })}
          </ul>
        </div>
      </div>
      {selectedToken && (
        <div className="checkout">
          <div className="maincheckout">
            <button
              className="btn-close"
              onClick={() => setSelectedToken(null)}
            >
              x
            </button>
            <div className="heading">
              <h3>Checkout</h3>
            </div>
            <p>
              You are about rent a{" "}
              <span className="bold">{selectedToken.token_id}</span>
              <span className="bold"> {`to the renting market`} </span>
            </p>
            <div className="detailcheckout mt-4">
              <div className="listcheckout">
                <h6>Renter</h6>
                <input
                  type="text"
                  name="buy_now_qty"
                  id="buy_now_qty"
                  className="form-control"
                  placeholder="KDA Account"
                  onChange={(e) =>
                    updateFormInput({ ...formInput, renter: e.target.value })
                  }
                />

                <h6>Renter Guard</h6>
                <input
                  type="text"
                  name="buy_now_qty"
                  id="buy_now_qty"
                  className="form-control"
                  placeholder="Account Guard"
                  onChange={(e) =>
                    updateFormInput({
                      ...formInput,
                      renter_guard: e.target.value,
                    })
                  }
                />

                <h6>Renter Private Key</h6>
                <input
                  type="text"
                  name="buy_now_qty"
                  id="buy_now_qty"
                  className="form-control"
                  placeholder="KDA"
                  onChange={(e) =>
                    updateFormInput({
                      ...formInput,
                      renterPrivKey: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="heading">
              <p>You will pay</p>
              <div className="subtotal">{`${selectedToken.rent_price} + ${selectedToken.royalty}KDA`}</div>
            </div>
            <button
              className="btn-main lead mb-5"
              onClick={() => {
                console.log("Rent");
                const parsedGuard = JSON.parse(formInput.renter_guard);
                rentToken({
                  ...formInput,
                  token: selectedToken,
                  renter_guard: parsedGuard,
                });
              }}
            >
              Rent Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RentMarketplace;
