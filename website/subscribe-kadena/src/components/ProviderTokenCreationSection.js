import React, {useState} from "react";
import "../App.css";
import {testCreateToken, testExtendToken, testMintToken, testOfferToken, testSignWithdrawal, testWithdrawToken, testWithdrawTokenSharded} from '../Marmalade/test/transferPolicyTest'
import { Button } from "./Button";
import "./ProviderTokenCreationSection.css";


function HeroSection() {
  const[signature, setSignature] = useState({})
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
          onClick={()=>{setSignature(testSignWithdrawal())}}
        >
          Sign WITHDRAW
        </Button>
        <Button
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--medium"
          onClick={()=>{testWithdrawToken(signature.extensionRawCmd, signature.subscriberSig)}}
        >
          WITHDRAW
        </Button>
        <Button
          className="btns"
          buttonStyle="btn--primary"
          buttonSize="btn--large"
          onClick={()=>{setSignature(testExtendToken())}}
        >
          EXTEND
        </Button>
        <Button
          className="btns"
          buttonStyle="btn--primary"
          buttonSize="btn--large"
          onClick={()=>{testOfferToken()}}
        >
          OFFER
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
