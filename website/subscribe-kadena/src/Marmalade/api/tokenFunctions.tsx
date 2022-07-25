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
import Pact, { fetchSendPreparedCmd, getRawCmd, signCosigned } from '../pact-lang-api/pact-lang-api'

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
          {ks: newKs, amount,
          "token-mint-price": 1.0
          ,"provider-account":"mike.tanto"},
          [SigData.mkCap(`${hftAPI.contractAddress}.MINT`,[tokenId, receiverAccount, Number.parseFloat(amount)]),
          SigData.mkCap(`coin.TRANSFER`,[receiverAccount,"mike.tanto", Number.parseFloat("1.0")])
        ]
        );
      return result
}




export const mintToken = async (
  account:string = "",accountPrivKey:string, tokenId:string, amount:Number, keyset:Guard|string, tokenMintPrice:Number, providerAccount:string
) => {
    const accountPubKey =  (Pact.crypto.restoreKeyPairFromSecretKey(accountPrivKey) as any).publicKey
    const mint:any= await Pact.fetch.send(
      {
        pactCode: `(${hftAPI.contractAddress}.mint "${tokenId}" "${account}" (read-keyset 'ks) (read-decimal 'amount))`,
        networkId: 'testnet04',
        keyPairs: [{
          //EXCHANGE ACCOUNT KEYS
          //  PLEASE KEEP SAFE
          publicKey: accountPubKey, //Signing PubK
          secretKey: accountPrivKey,//signing secret key
          clist: [
            //capability for gas
            {
              name: `coin.GAS`,
              args: []
            },
            {
              name: `${hftAPI.contractAddress}.MINT`,
              args: [tokenId, account, amount]
            },
            {
              name: "coin.TRANSFER",
              args:[account,providerAccount, tokenMintPrice]
            }
          ]
        }],
        meta: Pact.lang.mkMeta(account as string, "1" , 0.000001, 100000, creationTime(), 28800),
        envData: {ks: keyset, amount,
          "token-mint-price": tokenMintPrice
          ,"provider-account":providerAccount}
      },
      `https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact`
    )
    const reqKey = mint.requestKeys[0]
    console.log(reqKey)
    return reqKey
  }

export const createToken = async (
    precision:Number,
    id:String,
    policy:Policy,
    policyParams:Object,
    accountPrivKey:String,
    account:String,
  ) => {
      const accountPubKey =  (Pact.crypto.restoreKeyPairFromSecretKey(accountPrivKey) as any).publicKey
      const create:any= await Pact.fetch.send(
        {
          pactCode: `(${hftAPI.contractAddress}.create-token "${id}" ${precision} (read-msg 'manifest) ${policy.api.contractAddress})`,
          networkId: 'testnet04',
          keyPairs: [{
            //EXCHANGE ACCOUNT KEYS
            //  PLEASE KEEP SAFE
            publicKey: accountPubKey, //Signing PubK
            secretKey: accountPrivKey,//signing secret key
            clist: [
              //capability for gas
              {
                name: `coin.GAS`,
                args: []
              }
            ]
          }],
          meta: Pact.lang.mkMeta(account as string, "1" , 0.000001, 100000, creationTime(), 28800),
          envData: policyParams,
        },
        `https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact`
      )
      const reqKey = create.requestKeys[0]
      console.log(reqKey)
      return reqKey
    }

    export const withdrawTokenSignature = (wallet:Wallet,providerAccount:string = "", subscriberAccount:string = "", tokenId:string, providerKeyset:Guard|string, amount:string):SigExecData=>{
      const {accountName, signingKey, networkId, gasPrice, gasLimit} = wallet;
      let result:SigExecData = {hash: "" , cmd: "", sigs: []}
      //Confirmation of minting capability
          result = signExecHftCommand(wallet,
            `(${hftAPI.contractAddress}.transfer-create "${tokenId}" "${subscriberAccount}" "${providerAccount}" (read-keyset 'ks) (read-decimal 'amount))`,
            {ks: providerKeyset, amount},
            [SigData.mkCap(`${hftAPI.contractAddress}.TRANSFER`,[tokenId, subscriberAccount,providerAccount, Number.parseFloat(amount)]),
          ]
          );
        return result
  }

  export const getSubscriberWithdrawalSig = (tokenId:string,subscriberKeyset:any, subscriberAccount:string,providerAccount:string,providerKeyset:any, subscriberPrivKey:string)=>{
    const subscriberPubKey = subscriberKeyset.keys[0]
    const providerPubKey = providerKeyset.keys[0]
    const extensionRawCmd = getRawCmd(
      [{
        //EXCHANGE ACCOUNT KEYS
        //  PLEASE KEEP SAFE
        publicKey: providerPubKey, //Signing PubKey,
        clist: [
          {
            name: `coin.GAS`,
            args: []
          }
        ]
      },
      {
        //EXCHANGE ACCOUNT KEYS
        //  PLEASE KEEP SAFE
        publicKey: subscriberPubKey, //Signing PubK
        clist: [
          //capability to transfer crosschain
          {
            name: `${hftAPI.contractAddress}.TRANSFER`,
            args: [tokenId, subscriberAccount,providerAccount, 1.0]
          }
        ]
      }],
      tokenId, `(${hftAPI.contractAddress}.transfer-create "${tokenId}" "${subscriberAccount}" "${providerAccount}" (read-keyset 'ks) 1.0)`,
      {ks: providerKeyset}, Pact.lang.mkMeta(providerAccount as string, "1" , 0.000001, 100000, creationTime(), 28800),
      "testnet04" as any, []
    )
    const subscriberSig = Pact.crypto.sign(extensionRawCmd, {publicKey: subscriberPubKey, secretKey: subscriberPrivKey,clist: [
      //capability to transfer crosschain
      {
        name: `${hftAPI.contractAddress}.TRANSFER`,
        args: [tokenId, subscriberAccount,providerAccount, 1.0]
      }
    ]})
    return {extensionRawCmd,subscriberSig}
  }
  export const withdrawToken = async (
    extensionRawCmd:any, subscriberSig:any, providerKeyset:Guard|string,providerPrivKey:string
  ) => {
     const providerPubKey = (providerKeyset as any).keys[0]
     const preparedCmd = signCosigned(extensionRawCmd,[{publicKey: providerPubKey, secretKey: providerPrivKey,clist: [
      {
        name: `coin.GAS`,
        args: []
      }
    ]}],subscriberSig)
    console.log(preparedCmd)

    const extend = await fetchSendPreparedCmd(preparedCmd,`https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact`)
    const reqKey = extend.requestKeys[0]
    return reqKey
    }

  export const extendTokenSignature = (wallet:Wallet,providerAccount:string = "", subscriberAccount:string = "", tokenId:string, providerKeyset:Guard|string, amount:string):SigExecData=>{
    const {accountName, signingKey, networkId, gasPrice, gasLimit} = wallet;
    let result:SigExecData = {hash: "" , cmd: "", sigs: []}
    //Confirmation of minting capability
        result = signExecHftCommand(wallet,
          `(${hftAPI.contractAddress}.transfer "${tokenId}" "${providerAccount}" "${subscriberAccount}" (read-decimal 'amount))`,
          {ks: providerKeyset, amount, "extender-account":"mike.tanto.no2"
          ,"token-extend-price":1.0},
          [SigData.mkCap(`${hftAPI.contractAddress}.TRANSFER`,[tokenId,providerAccount,subscriberAccount, Number.parseFloat(amount)]),
          SigData.mkCap(`coin.TRANSFER`,[subscriberAccount, providerAccount, 1.0]),
          SigData.mkCap("free.transferable-subscribe-policy.EXTEND", [{"id": "mike-netflix-subscription","manifest": {"data": [{"datum": {"assetUrl": "https://www.netflix.com","creationDate": "2022-07-11","providerName": "Netflix Co.ltd","title": "Mike's Netflix Subscription"},"hash": "O-3r0ko5_xtyTTLMKKuuKQCCaFD-YWFBv5vG6Rw6kRE","uri": {"data": "pact:schema","scheme": "contract.schema"}}],"hash": "Z0oATAwGwITSiBfiNIW9W3_pmepTGA84zM1H7xh8yBU","uri": {"data": "SOMEIMGDATA","scheme": "image/jpeg;base64"}},"precision": 1,"supply": 1.0},subscriberAccount, 1.0])
        ]
        );
      return result
}


export const extendToken = async (
  tokenId:String,
  tokenInfo:any,
  subscriberPrivKey:String,
  providerPrivKey:String,
  tokenExtendPrice:Number,
  providerAccount:String,
  subscriberAccount:String
) => {
    const providerPubKey =  (Pact.crypto.restoreKeyPairFromSecretKey(providerPrivKey) as any).publicKey
    const subscriberPubKey =  (Pact.crypto.restoreKeyPairFromSecretKey(subscriberPrivKey) as any).publicKey
    const getTokenInfo:any= await Pact.fetch.local({
      pactCode: `(at 'token (${hftAPI.contractAddress}.get-policy-info (read-string 'token-id)))`,
      //pact-lang-api function to construct transaction meta data
      envData: {"token-id":tokenId},
      meta: Pact.lang.mkMeta(subscriberAccount as string, "1" , 0.000001, 100000, creationTime(), 28800),
    },`https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact`)
    console.log(getTokenInfo.result.data)
    const extensionRawCmd = getRawCmd(
      [{
        //EXCHANGE ACCOUNT KEYS
        //  PLEASE KEEP SAFE
        publicKey: subscriberPubKey, //Signing PubK
        secretKey: subscriberPrivKey,//signing secret key
        clist: [
          //capability to transfer crosschain
          {
            name: `coin.GAS`,
            args: []
          },
          {
            name: `coin.TRANSFER`,
            args: [subscriberAccount, providerAccount, tokenExtendPrice]
          },
          //capability for gas
          {
            name: "free.transferable-subscribe-policy.EXTEND",
            args: [getTokenInfo.result.data,"mike-subscriber",1.0]
          }
        ]
      },
      {
        //EXCHANGE ACCOUNT KEYS
        //  PLEASE KEEP SAFE
        publicKey: providerPubKey, //Signing PubK
        secretKey: providerPrivKey,//signing secret key
        clist: [
          //capability to transfer crosschain
          {
            name: `marmalade.ledger.TRANSFER`,
            args: [tokenId, providerAccount, subscriberAccount, 1.0]
          }
        ]
      }],
      undefined, `(${hftAPI.contractAddress}.transfer "${tokenId}" "${providerAccount}" "${subscriberAccount}" 1.0)`,
      {"extender-account":subscriberAccount,"token-extend-price":tokenExtendPrice}, Pact.lang.mkMeta(subscriberAccount as string, "1" , 0.000001, 100000, creationTime(), 28800),
      "testnet04" as any, []
    )
    console.log(extensionRawCmd)
    const providerSig = Pact.crypto.sign(extensionRawCmd, {publicKey: providerPubKey, secretKey: providerPrivKey,  clist: [
      //capability to transfer crosschain
      {
        name: `marmalade.ledger.TRANSFER`,
        args: [tokenId, providerAccount, subscriberAccount, 1.0]
      }
    ]})
    console.log(providerSig)
    
    const preparedCmd = signCosigned(extensionRawCmd,[{publicKey: subscriberPubKey, secretKey: subscriberPrivKey, clist: [
      //capability to transfer crosschain
      {
        name: `coin.GAS`,
        args: []
      },
      {
        name: `coin.TRANSFER`,
        args: [subscriberAccount, providerAccount, tokenExtendPrice]
      },
      //capability for gas
      {
        name: `free.transferable-subscribe-policy.EXTEND`,
        args: [getTokenInfo.result.data,"mike-subscriber",1.0]
      }
    ]}],[providerSig])
    console.log(preparedCmd)

    const extend = await fetchSendPreparedCmd(preparedCmd,`https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact`)
    const reqKey = extend.requestKeys[0]
      console.log(reqKey)


    /*const reqKey = create.requestKeys[0]
    console.log(reqKey)*/
  }

  export const withdrawTokenFull = async (
    providerAccount:string = "", subscriberPrivKey:string, subscriberAccount:string = "", tokenId:string, providerKeyset:Guard|string, amount:Number, providerPrivKey:string
  ) => {
      const subscriberPubKey =  (Pact.crypto.restoreKeyPairFromSecretKey(subscriberPrivKey) as any).publicKey
      const providerPubKey = (Pact.crypto.restoreKeyPairFromSecretKey(providerPrivKey) as any).publicKey
      const withdraw:any= await Pact.fetch.send(
        {
          pactCode: `(${hftAPI.contractAddress}.transfer-create "${tokenId}" "${subscriberAccount}" "${providerAccount}" (read-keyset 'ks) (read-decimal 'amount))`,
          networkId: 'testnet04',
          keyPairs: [{
            //EXCHANGE ACCOUNT KEYS
            //  PLEASE KEEP SAFE
            publicKey: providerPubKey, //Signing PubK
            secretKey: providerPrivKey,//signing secret key
            clist: [
              //capability for gas
              {
                name: `coin.GAS`,
                args: []
              }]
          },
          {
            //EXCHANGE ACCOUNT KEYS
            //  PLEASE KEEP SAFE
            publicKey: subscriberPubKey, //Signing PubK
            secretKey: subscriberPrivKey,//signing secret key
            clist: [
              //capability for gas
              {
                name: `${hftAPI.contractAddress}.TRANSFER`,
                args: [tokenId, subscriberAccount,providerAccount, amount]
              }
            ]
          }
          ],
          meta: Pact.lang.mkMeta(providerAccount as string, "1" , 0.000001, 100000, creationTime(), 28800),
          envData: {ks: providerKeyset, amount}
        },
        `https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact`
      )
      const reqKey = withdraw.requestKeys[0]
      console.log(reqKey)
    }

    export const withdrawTokenSharded = async (
      tokenId:String,
      subscriberPrivKey:String,
      providerPrivKey:String,
      subscriberAccount:String,
      providerAccount:String,
      providerKeyset:any
    ) => {
        const providerPubKey =  (Pact.crypto.restoreKeyPairFromSecretKey(providerPrivKey) as any).publicKey
        const subscriberPubKey =  (Pact.crypto.restoreKeyPairFromSecretKey(subscriberPrivKey) as any).publicKey

        const extensionRawCmd = getRawCmd(
          [{
            //EXCHANGE ACCOUNT KEYS
            //  PLEASE KEEP SAFE
            publicKey: providerPubKey, //Signing PubK
            clist: [
              //capability to transfer crosschain
              {
                name: `coin.GAS`,
                args: []
              }
            ]
          },
          {
            //EXCHANGE ACCOUNT KEYS
            //  PLEASE KEEP SAFE
            publicKey: subscriberPubKey, //Signing PubK
            clist: [
              //capability to transfer crosschain
              {
                name: `${hftAPI.contractAddress}.TRANSFER`,
                args: [tokenId,subscriberAccount, providerAccount,1.0]
              }
            ]
          }],
          "withdraw", `(${hftAPI.contractAddress}.transfer-create "${tokenId}" "${subscriberAccount}" "${providerAccount}"  (read-keyset 'ks) 1.0)`,
          {ks:providerKeyset}, Pact.lang.mkMeta(providerAccount as string, "1" , 0.0000001, 100000, creationTime(), 28800),
          "testnet04" as any, []
        )
        console.log(extensionRawCmd)
        const providerSig = Pact.crypto.sign(extensionRawCmd, {publicKey: subscriberPubKey, secretKey: subscriberPrivKey, clist: [
          //capability to transfer crosschain
          {
            name: `${hftAPI.contractAddress}.TRANSFER`,
            args: [tokenId, subscriberAccount,providerAccount, 1.0]
          }
        ]})
        console.log(providerSig)
        
        const preparedCmd = signCosigned(extensionRawCmd,[{publicKey: providerPubKey, secretKey: providerPrivKey,  clist: [
          //capability to transfer crosschain
          {
            name: `coin.GAS`,
            args: []
          }
        ]}],[providerSig])
        console.log(preparedCmd)
    
        const extend = await fetchSendPreparedCmd(preparedCmd,`https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact`)
        const reqKey = extend.requestKeys[0]
          console.log(reqKey)
    
    
        /*const reqKey = create.requestKeys[0]
        console.log(reqKey)*/
      }