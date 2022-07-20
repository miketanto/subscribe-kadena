import React from "react";
import "../../App.css";
import TokenCreate from "../create-tokens/ProviderTokenCreationSection";
import SubscriptionCreate from "../create-tokens/SubscriptionCreate";

function CreateTokens() {
  return (
    <>
      <TokenCreate />
      <SubscriptionCreate/>
    </>
  );
}

export default CreateTokens;
