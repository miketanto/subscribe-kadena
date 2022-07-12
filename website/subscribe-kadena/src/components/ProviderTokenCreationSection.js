import React from "react";
import "../App.css";
import {testCreateToken, testExtendToken, testMintToken, testWithdrawToken} from '../Marmalade/test/transferPolicyTest'
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
          onClick={()=>testCreateToken()}
        >
          CREATE
        </Button>
        <Button
          className="btns"
          buttonStyle="btn--primary"
          buttonSize="btn--medium"
          onClick={()=>testMintToken()}
        >
          SUBSCRIBE
        </Button>
        <Button
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--medium"
          onClick={()=>testWithdrawToken()}
        >
          WITHDRAW
        </Button>
        <Button
          className="btns"
          buttonStyle="btn--primary"
          buttonSize="btn--large"
          onClick={()=>testExtendToken()}
        >
          EXTEND
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
