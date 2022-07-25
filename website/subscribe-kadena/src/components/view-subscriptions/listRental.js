import { transferableSubscribePolicy } from "../../Marmalade/test/transferPolicyTest";
import Marmalade from '../../Marmalade'
import Pact from '../../Marmalade/pact-lang-api/pact-lang-api'
import axios from "axios";
import { getSubscriberWithdrawalSig } from "../../Marmalade/api/tokenFunctions";

const providerPrivKey = "9fb09d4a2d472b78e6e7c9965132756d45af6a14c3e78d311ef4af0cf63f5db1"
const buyerPrivKey = "b48fe54b78709be365b16cf34cab8c1325eb8ab900d4624589fac3706ca56881"

export const offerRentToken = async (options)=>{
    const {token:{token_id, owner,owner_guard},rent_interval,renter_subsidy,expiry_block, rent_price} = options
    const rent_interval_seconds = rent_interval*86400
    const txReqKey = await Marmalade.transaction.offerToken(buyerPrivKey,token_id,"","",owner,owner_guard,rent_price,rent_interval_seconds,renter_subsidy,"1.0",expiry_block)
    let retries = 8;
    let res = {};
    while (retries > 0) {
      //sleep the polling
      res = await Pact.fetch.poll({requestKeys:[txReqKey]}, `https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact`);
      try {
        if (res[txReqKey]) {
          retries = -1;
        } else {
          console.log('RETRY')
          retries = retries - 1;
        }
      } catch(e) {
          retries = retries - 1;
      }
      await new Promise(r => setTimeout(r, 15000));
    };

    const body_params = {
        rent_interval : rent_interval_seconds,
        renter_subsidy: renter_subsidy,
        rent_pact_id : txReqKey,
        rent_price:rent_price,
        offer_expiry_block: expiry_block
    }

    axios.post(`${process.env.REACT_APP_SUBSCRIPTION_API}/token/list`,body_params,{ params: {
        id:token_id
      }}).then((res)=>{
        console.log(res)
    })
      //Make token in database
}