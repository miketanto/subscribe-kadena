/**
 * Module: Token Functions
 * Functionality: Token creation and minting api
 * 
 * TODO:
 * - Make more robust error catching
 * - Move all signature logic to a different file
 * - make signature logic more user-friendly
 * -Make Json parse possible for policy params
 */

import { Policy, SigExecData, Wallet, Guard } from "../types/customTypes";
import { hftAPI } from "../constants/hftApi";
import { checkSchema } from "../utils/checkSchema";
import {signExecHftCommand} from '../utils/apiUtils'
import {SigData} from '../utils/Pact.SigBuilder'
import { creationTime } from "../config/config";
const Pact = require('../pact-lang-api/pact-lang-api')

/**
 * createTokenSignature
 * @param wallet 
 * @param policy 
 * @param policyParams 
 * @param id 
 * @param precision 
 * @returns {SigExecData} Raw Signature command to paste in signature builder 
 * @todo Once wallet works this need to be subbed in to the wallet
 */

export const createTokenSignature = (wallet:Wallet, policy:Policy, policyParams:Object, id:string, precision: Number): SigExecData =>{
    const {api, schema} = policy;
    let result:SigExecData = {hash: "" , cmd: "", sigs: []}
        if(checkSchema(policyParams,schema)){
            console.log("Schema matched")
            result = signExecHftCommand(wallet,
                `(${hftAPI.contractAddress}.create-token "${id}" ${precision} (read-msg 'manifest) ${api.contractAddress})`,policyParams
                )
        }else{
            console.log("create-token Policy Parameter Error");
        }
    return result
}
/**
 * 
 * @param wallet 
 * @param account | string, account that receives mint, Will be checked if they are "whitelisted" as receiver in policy
 */
export const mintTokenSignature = (wallet:Wallet,account:string = "", tokenId:string, amount:string, keyset:Guard|string):SigExecData=>{
    const {accountName, signingKey, networkId, gasPrice, gasLimit} = wallet;
    const receiverAccount = account.length === 0 ? accountName: account; 
    const newKs = typeof(keyset) === "object"?keyset:JSON.parse(keyset)
    let result:SigExecData = {hash: "" , cmd: "", sigs: []}
    //Confirmation of minting capability
    //Can be commented out
    console.debug(Pact.lang.mkCap("MINT Cap"
              , "Authenticates that you can mint"
              , `${hftAPI.contractAddress}.MINT`
              , [tokenId, receiverAccount, Number.parseInt(amount)]));
        result = signExecHftCommand(wallet,
          `(${hftAPI.contractAddress}.mint "${tokenId}" "${receiverAccount}" (read-keyset 'ks) (read-decimal 'amount))`,
          {ks: newKs, amount},
          [SigData.mkCap(`${hftAPI.contractAddress}.MINT`,[tokenId, receiverAccount, Number.parseFloat(amount)])]
        );
      return result
}



export const createToken = async (
    precision,
    id,
    accountPrivKey,
    policy,
    policyParams
  ) => {
      const marmaladeGasStation = 'free.marmalade-gas-station'
      const accountPubKey =  Pact.crypto.restoreKeyPairFromSecretKey(accountPrivKey).publicKey
      const create = await Pact.fetch.send(
        {
          pactCode: `(${hftAPI.contractAddress}.create-token "${id}" ${precision} (read-msg 'manifest) ${policy.api.contractAddress})`,
          networkId: 'testnet04',
          keyPairs: [{
            //EXCHANGE ACCOUNT KEYS
            //  PLEASE KEEP SAFE
            publicKey: accountPubKey, //Signing PubK
            secretKey: accountPrivKey,//signing secret key
            clist: [
              //capability to transfer crosschain
              {
                name: `${marmaladeGasStation}.GAS_PAYER`,
                args: ["", { int: 1 }, 1.0]
              },
              //capability for gas
              {
                name: `coin.GAS`,
                args: []
              }
            ]
          }],
          meta: Pact.lang.mkMeta(marmaladeGasStation, 1 , 0.000001, 100000, creationTime, 28800),
          envData: policyParams,
        },
        `https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact`
      )
      const reqKey = create.requestKeys[0]
      console.log(reqKey)
    }