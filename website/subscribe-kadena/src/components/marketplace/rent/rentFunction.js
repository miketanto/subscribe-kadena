import { transferableSubscribePolicy } from "../../../Marmalade/test/transferPolicyTest";
import Marmalade from '../../../Marmalade'
import Pact from '../../../Marmalade/pact-lang-api/pact-lang-api'
import axios from "axios";
import { getSubscriberWithdrawalSig } from "../../../Marmalade/api/tokenFunctions";
import { buyToken } from "../../../Marmalade/api/orderBookFunctions";
const providerPrivKey = "9fb09d4a2d472b78e6e7c9965132756d45af6a14c3e78d311ef4af0cf63f5db1"
const buyerPrivKey = "b48fe54b78709be365b16cf34cab8c1325eb8ab900d4624589fac3706ca56881"

export const rentToken = async (options)=>{
    const {token:{
        owner, owner_guard, provider, rent_price, offer_expiry_block,rent_pact_id, token_id
        , royalty
    }, renter, renter_guard, renterPrivKey} = options

    const txReqKey = await buyToken(renter,renter_guard,
        renterPrivKey,owner,provider, rent_price, offer_expiry_block,
        rent_pact_id, token_id, royalty)
        //listens to response to transaction sent
        //  note method will timeout in two minutes
        //    for lower level implementations checkout out Pact.fetch.poll() in pact-lang-api
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
    const {extensionRawCmd,subscriberSig} = 
    getSubscriberWithdrawalSig(token_id,renter_guard,renter,owner,owner_guard,renterPrivKey)
    //Make token in database
    const tokenParams = {
        rent_tx_raw_cmd: extensionRawCmd,
        rent_withdrawal_sig: subscriberSig,
        renter:renter,
        renter_guard:renter_guard
      }
    axios.post(`${process.env.REACT_APP_SUBSCRIPTION_API}/token/buy`, tokenParams,{
        params:{
            id:token_id
        }
    }).then((res)=>{
        console.log(res)
    })
    //TODO: Make dashed and lowercased names

}
