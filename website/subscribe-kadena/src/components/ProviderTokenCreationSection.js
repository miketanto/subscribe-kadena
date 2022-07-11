import React from "react";
import "../App.css";
import { Button } from "./Button";
import "./ProviderTokenCreationSection.css";

function HeroSection() {
  return (
    <div className="tc-container">
      <h1>Let's create your token</h1>
      <p>Enter the information below to create it!</p>
      <div className="tc-btns">
        <Button
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--medium"
        >
          CREATE
        </Button>
        <Button
          className="btns"
          buttonStyle="btn--primary"
          buttonSize="btn--medium"
        >
          SUBSCRIBE
        </Button>
        <Button
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--medium"
        >
          WITHDRAW
        </Button>
        <Button
          className="btns"
          buttonStyle="btn--primary"
          buttonSize="btn--large"
        >
          EXTEND
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
