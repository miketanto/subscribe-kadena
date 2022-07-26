import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../App.css";
import CardItem from "./SubscriptionCard";
import { offerRentToken } from "./listRental";
import "./ViewSubscriptions.css";

const token = [
  { name: "Netflix", expiry: "1 month" },
  { name: "Disney+", expiry: "1 month" },
  { name: "Hulu", expiry: "1 month" },
  { name: "Joes", expiry: "1 month" },
  { name: "Kams", expiry: "1 month" },
  { name: "Lion", expiry: "1 month" },
];

/*token.token_id
token.expiry_time

*/

function ViewSubscriptions() {
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState();
  const [formInput, updateFormInput] = useState({
    rent_interval: "",
    renter_subsidy: "",
    expiry_block: "",
    rent_price: "",
  });
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SUBSCRIPTION_API}/token/get`)
      .then((res) => {
        console.log(res.data.payload.tokens);
        setTokens(res.data.payload.tokens);
      });
  }, []);

  return (
    <div className="view_susbcriptions_page">
      <h1>Your Subscriptions</h1>
      <div className="subscriptions_container">
        <div className="subscriptions_wrapper">
          {/*tokens.map((token, key) => ( */}
          <CardItem
            name="Maserati"
            expiry="30 months"
            onClick={() => setSelectedToken(token)}
          />
          {/*}))}*/}
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
            <div className="heading">Checkout</div>
            <p>
              You are about to rent out a{" "}
              <span className="bold">{selectedToken.token_id}</span>
              <span className="bold"> {`to the renting market`} </span>
            </p>
            <div className="detailcheckout mt-4">
              <div className="listcheckout">
                <h6>Rent Interval (in days)</h6>
                <input
                  type="number"
                  name="buy_now_qty"
                  id="buy_now_qty"
                  className="form-control"
                  placeholder="Days"
                  onChange={(e) =>
                    updateFormInput({
                      ...formInput,
                      rent_interval: e.target.value,
                    })
                  }
                />

                <h6>Renter Subsidy</h6>
                <input
                  type="number"
                  name="buy_now_qty"
                  id="buy_now_qty"
                  className="form-control"
                  placeholder="KDA"
                  onChange={(e) =>
                    updateFormInput({
                      ...formInput,
                      renter_subsidy: e.target.value,
                    })
                  }
                />

                <h6>Rent Price</h6>
                <input
                  type="number"
                  name="buy_now_qty"
                  id="buy_now_qty"
                  className="form-control"
                  placeholder="KDA"
                  onChange={(e) =>
                    updateFormInput({
                      ...formInput,
                      rent_price: e.target.value,
                    })
                  }
                />
                <h6>Expiry Block</h6>
                <input
                  type="number"
                  name="buy_now_qty"
                  id="buy_now_qty"
                  className="form-control"
                  placeholder="KDA"
                  onChange={(e) =>
                    updateFormInput({
                      ...formInput,
                      expiry_block: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <button
              className="btn-main lead mb-5"
              onClick={() => {
                console.log("Rent");
                offerRentToken({ ...formInput, token: selectedToken });
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

export default ViewSubscriptions;
