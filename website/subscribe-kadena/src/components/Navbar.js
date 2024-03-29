import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import "./Navbar.css";

//image imports
import Logo from "./images/SubZero_Logo.png";
import WalletStatus from "./WalletStatus";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener("resize", showButton);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            SubZero Protocol
            <img className="image-format" src={Logo} alt="Provider Image" />
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/create-tokens"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Create Tokens
              </Link>
            </li>

            <li>
              <Link
                to="/sign-up"
                className="nav-links-mobile"
                onClick={closeMobileMenu}
              >
                Sign Up
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/view-subscriptions"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Rent Out Subscriptions
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/buy-marketplace"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Marketplace
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/rent-marketplace"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Rent Marketplace
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/withdraw-subscription"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Withdraw Subscription
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
