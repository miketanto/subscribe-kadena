import React, { useState } from "react";
import { Link } from "react-router-dom";
import { withdrawToken } from "../../Marmalade/api/tokenFunctions";
import "./ViewSubscriptions.css";

function SubscriptionCard({
  token:{withdrawal_sig, tx_raw_cmd, owner, token_id,provider_guard,provider}
}) {
  const [ signingPrivKey, setSigningPrivKey] = useState("9fb09d4a2d472b78e6e7c9965132756d45af6a14c3e78d311ef4af0cf63f5db1")
  
  return (
    <>
      <div className="circle">
        <p className="text">{token_id}</p>
        <button
        onClick={()=>withdrawToken(tx_raw_cmd, withdrawal_sig,provider_guard,signingPrivKey).then((res)=>console.log(res))}
        >Withdraw</button>
      </div>
    </>
  );
}

export default SubscriptionCard;
