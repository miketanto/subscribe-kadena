import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SubscriptionCreate.css";

function SubscriptionCreate() {
  const [formInput, updateFormInput] = useState({
    name: "",
    provider: "",
    provider_guard: "",
    description: "",
  });

  const createSubscription = async (options) => {
    const parsedOptions = {
      ...options,
      provider_guard: JSON.parse(options.provider_guard),
    };
    try {
      axios
        .post(
          `${process.env.REACT_APP_SUBSCRIPTION_API}/subscription/create`,
          parsedOptions
        )
        .then((res) => {
          console.log(res);
        });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="create_page">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <section
        className="jumbotron breadcumb no-bg"
        style={{ backgroundImage: `url(${"./img/background/subheader.jpg"})` }}
      >
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12">
                <h1 className="text-center">Create Subscription</h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container">
        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
            <form id="form-create-item" className="form-border" action="#">
              {/* this is the section with all the textboxes */}
              <div className="field-set">
                <div className="section_wrapper">
                  <div className="textbox_tag">Name</div>
                  <div className="textbox_wrapper">
                    <input
                      type="text"
                      name="item_title"
                      id="item_title"
                      className="textbox"
                      placeholder="e.g. 'Crypto Funk'"
                      onChange={(e) =>
                        updateFormInput({ ...formInput, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="section_wrapper">
                  <div className="textbox_tag">Description</div>
                  <div className="textbox_wrapper">
                    {/* <textarea ... remove type ... > </textarea>*/}
                    <input
                      data-autoresize
                      type="text"
                      name="item_desc"
                      id="item_desc"
                      className="textbox"
                      placeholder="e.g. 'Montly Gold membership'"
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="section_wrapper">
                  <div className="textbox_tag">Interval</div>
                  <div className="textbox_wrapper">
                    <input
                      type="number"
                      name="item_quantity"
                      id="item_quantity"
                      className="textbox"
                      placeholder="Interval in Days"
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          interval: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="section_wrapper">
                  <div className="textbox_tag">Provider Royalties</div>
                  <div className="textbox_wrapper">
                    <input
                      type="number"
                      name="item_royalty"
                      id="item_royalty"
                      className="textbox"
                      placeholder="KDA"
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          royalty: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="section_wrapper">
                  <div className="textbox_tag">Price</div>
                  <div className="textbox_wrapper">
                    <input
                      type="number"
                      name="item_royalty"
                      id="item_royalty"
                      className="textbox"
                      placeholder="KDA"
                      onChange={(e) =>
                        updateFormInput({ ...formInput, price: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="provider_info_container">
                  <div className="textbox_tag">Provider Info</div>
                  <div className="textbox_wrapper">
                    <div className="provider_info_textbox_container">
                      <input
                        type="text"
                        name="item_royalty"
                        id="item_royalty"
                        className="textbox"
                        placeholder="Provider Account"
                        onChange={(e) =>
                          updateFormInput({
                            ...formInput,
                            provider: e.target.value,
                          })
                        }
                      />
                      <div className="textbox_wrapper">
                        <input
                          type="text"
                          name="item_royalty"
                          id="item_royalty"
                          className="textbox"
                          placeholder="Provider Guard"
                          onChange={(e) =>
                            updateFormInput({
                              ...formInput,
                              provider_guard: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div></div>
                <div className="btn_wrapper">
                  <div
                    className="btn-one"
                    onClick={() => createSubscription(formInput)}
                  >
                    <span type="button" id="submit" className="create_button">
                      Create NFT
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SubscriptionCreate;
