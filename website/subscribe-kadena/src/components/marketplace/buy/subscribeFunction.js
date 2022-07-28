import { transferableSubscribePolicy } from "../../../Marmalade/test/transferPolicyTest";
import Marmalade from '../../../Marmalade'
import Pact from '../../../Marmalade/pact-lang-api/pact-lang-api'
import axios from "axios";
import { createTokenQuickSign, getSubscriberWithdrawalSig } from "../../../Marmalade/api/tokenFunctions";

const providerPrivKey = "9fb09d4a2d472b78e6e7c9965132756d45af6a14c3e78d311ef4af0cf63f5db1"
const buyerPrivKey = "b48fe54b78709be365b16cf34cab8c1325eb8ab900d4624589fac3706ca56881"

export const subscribeToken = async (options)=>{
    const {data, subscription:{
        provider, provider_guard, royalty, interval, name,subscription_id,price
    }, owner, owner_guard} = options
    const formattedToken = name.toLowerCase().replace(/\s/g, '-'); 
    const formattedName = owner.concat(`-${formattedToken}`)
    const currentTime = new Date().toISOString().slice(0,19).concat('Z')
    const expiryTime =  new Date(new Date().getTime() + (interval*1000)).toISOString().slice(0,19).concat('Z')
    console.log(expiryTime)
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
        "interval":interval,
        "first-start-time":currentTime, 
        "min-amount":1.0, 
        "max-supply":1.0
    }
    console.log(transferableSubscribeParams)
    const createTokenReqKey = await createTokenQuickSign(1,formattedName,transferableSubscribePolicy,transferableSubscribeParams,
      provider_guard.keys[0],provider)
    console.log(createTokenReqKey)


}
