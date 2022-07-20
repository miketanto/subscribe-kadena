import { transferableSubscribePolicy } from "../../Marmalade/test/transferPolicyTest";
import Marmalade from '../../Marmalade'
import Pact from '../../Marmalade/pact-lang-api/pact-lang-api'
import axios from "axios";
import { getSubscriberWithdrawalSig } from "../../Marmalade/api/tokenFunctions";
const providerPrivKey = "9fb09d4a2d472b78e6e7c9965132756d45af6a14c3e78d311ef4af0cf63f5db1"
const buyerPrivKey = "b48fe54b78709be365b16cf34cab8c1325eb8ab900d4624589fac3706ca56881"
export const subscribeToken = async (options)=>{
    const {data, subscription:{
        provider, provider_guard, royalty, interval, name,subscription_id
    }, owner, owner_guard, } = options
    const formattedName = name.toLowerCase().replace(/\s/g, '-');
    const currentTime = new Date().toISOString().slice(0,19).concat('Z')
    const intervalMilliSeconds = Number(interval)*86400
    const expiryTime =  new Date(new Date().getTime() + (intervalMilliSeconds)).toISOString().slice(0,19).concat('Z')
    const testDatumUri = await Marmalade.manifest.createUri("contract.schema","pact:schema")
    const testManifestUri = await Marmalade.manifest.createUri("image/jpeg;base64", "SOMEIMGDATA")
    const testDatum = await Marmalade.manifest.createDatum((testDatumUri.value), data)
    const testManifest = await Marmalade.manifest.createManifest(testManifestUri.value, [(testDatum.value)])
    
    const transferableSubscribeParams= {
        "manifest": (testManifest.value),
        "provider-guard":provider_guard, 
        "provider-account":provider,
        "owner-guard":owner_guard,
        "renter-guard":owner_guard,
        "provider-royalty":royalty,
        "owner-royalty":0.0,
        "trial-period":604800,
        "grace-period":604800,
        "pausable":"false",
        "expiry-time":expiryTime,
        "interval":intervalMilliSeconds/1000,
        "first-start-time":currentTime, 
        "min-amount":1.0, 
        "max-supply":1.0
    }
    console.log(transferableSubscribeParams)
    const createTokenReqKey = await Marmalade.token.createToken(1,formattedName,transferableSubscribePolicy,transferableSubscribeParams,providerPrivKey,provider)
    console.log(createTokenReqKey)

        //listens to response to transaction sent
        //  note method will timeout in two minutes
        //    for lower level implementations checkout out Pact.fetch.poll() in pact-lang-api
        let retries = 8;
        let res = {};
        while (retries > 0) {
          //sleep the polling
          res = await Pact.fetch.poll({requestKeys:[createTokenReqKey]}, `https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact`);
          try {
            if (res[createTokenReqKey]) {
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
    const mintTokenSigData = await Marmalade.token.mintToken(owner,buyerPrivKey,formattedName,1.0,owner_guard,1.0,provider)
    console.log(mintTokenSigData)
    const {extensionRawCmd,subscriberSig} = getSubscriberWithdrawalSig(name,owner_guard,owner,provider,provider_guard,buyerPrivKey)
    //Make token in database
    const tokenParams = {
        token_id: name,
        manifest: testManifest.value,
        owner: owner,
        provider:provider,
        owner_guard: owner_guard,
        provider_guard: provider_guard,
        interval: interval,
        tx_raw_cmd: extensionRawCmd,
        withdrawal_sig: subscriberSig,
        subscription_id: subscription_id
      }
    axios.post(`${process.env.REACT_APP_SUBSCRIPTION_API}/token/create`, tokenParams).then((res)=>{
        console.log(res)
    })
    //TODO: Make dashed and lowercased names

}
