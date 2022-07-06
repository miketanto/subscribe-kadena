import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";
import { Button } from "./Button";

function Navbar() {
  // create state variables
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  //for clicks
  const handleClick = () => setClick(!click);
  //close the menu
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerwidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);
  // show button when window is resized
  window.addEventListener("resize", showButton);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            Subscribe Kadena <i class="fa-solid fa-bomb"></i>
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu-active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/services"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/products"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/create"
                className="nav-links-mobile"
                onClick={closeMobileMenu}
              >
                Create
              </Link>
            </li>
            <li>
              <Link
                to="/subscribe"
                className="nav-links-mobile"
                onClick={closeMobileMenu}
              >
                Subscribe
              </Link>
            </li>
            <li>
              <Link
                to="/extend"
                className="nav-links-mobile"
                onClick={closeMobileMenu}
              >
                Extend
              </Link>
            </li>
          </ul>
          {button && <Button buttonStyle="bin--outline">Create</Button>}

          {button && <Button buttonStyle="bin--outline">Subscribe</Button>}

          {button && <Button buttonStyle="bin--outline">Extend</Button>}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
