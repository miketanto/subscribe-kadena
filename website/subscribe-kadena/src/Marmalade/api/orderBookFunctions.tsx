/**
 * Module: Order Book Api
 * Functionality: 
 * - Offer and Buy tokens with fixed Quote(royalty or non-royalty) policies
 * 
 * 
 * 
 */

import { hftAPI } from "../constants/hftApi";
import { signExecHftCommand, signContHftCommand } from "../utils/apiUtils";
import { SigData } from "../utils/Pact.SigBuilder";
import {Wallet, Guard, Sale} from '../types/customTypes'
import Pact from '../pact-lang-api/pact-lang-api'
import { creationTime } from "../config/config";

export const saleTokenSignature = (
  wallet:Wallet,
  seller:string,
  amount:Number,
  price:Number, 
  recipient:string, 
  recipientGrd:Guard|string, 
  tokenId:string, 
  timeLimit:Number,
  fungibleTokenContract:string)=>{
        let result
        const parsedGuard = typeof(recipientGrd) === "string"? JSON.parse(recipientGrd):recipientGrd
        const quote = {
          "price": price,
          "recipient": recipient,
          "recipient-guard": parsedGuard,
          "fungible": {
            "refName": {
              "namespace":null,
              "name":fungibleTokenContract
            },
            "refSpec": [
              {
              "namespace":null,
              "name":"fungible-v2"
            }]
          }
        };
       
        result = signExecHftCommand(wallet,
          `(${hftAPI.contractAddress}.sale "${tokenId}" "${seller}" (read-decimal 'amount) (read-integer 'timeout))`,
          { amount: amount,
            timeout: timeLimit,
            quote
          },
          [SigData.mkCap(`${hftAPI.contractAddress}.OFFER`,[tokenId, seller, amount , {int: timeLimit}])]
        );
        return result
}

export const saleTokenSignatureAndObject = ( wallet:Wallet,
  seller:string,
  amount:Number,
  price:Number, 
  recipient:string, 
  recipientGrd:Guard|string, 
  tokenId:string, 
  timeLimit:Number,
  fungibleTokenContract:string)=>{
    const sigData = saleTokenSignature(wallet,seller,amount,price,recipient,recipientGrd,tokenId,timeLimit,fungibleTokenContract)
    const saleObj = {
      "tokenId":tokenId,
      "seller":seller,
      "buyer":"",
      "amount":amount,
      "timeout":timeLimit,
      "saleId": sigData.hash,
      "price":price
    }
    return {sigData,saleObj}
}

export const buyTokenSignature = (wallet:Wallet, pactId:string, buyer:string, buyerGrd:Guard|string,saleObj:Sale)=>{
  const parsedGuard = typeof(buyerGrd) === "string"? JSON.parse(buyerGrd):buyerGrd
  const{ tokenId, seller, amount,timeout,saleId,price} = saleObj
  let result = signContHftCommand(pactId, 1, false, wallet,"",
      { buyer: buyer,
        "buyer-guard": parsedGuard,
      },
      [
        SigData.mkCap(`${hftAPI.contractAddress}.BUY`,[tokenId, seller, buyer, amount, {"int": timeout}, saleId]),
        SigData.mkCap(`coin.TRANSFER`, [buyer, seller, (amount as number) * (price as number)])
      ]
    );
    saleObj.buyer = buyer;
    return result
}

export const withdrawTokenSignature = (wallet:Wallet, pactId:string, saleObj:Sale)=>{
  const{ tokenId, seller, amount,timeout,saleId,price} = saleObj
  let result = signContHftCommand(saleId, 0, true, wallet,"",{},[])
  return result
}

export const offerToken = async (
  sellerPrivKey:string, tokenId:string, buyerKeyset:any, buyerAccount:string, sellerAccount:string ,sellerKeyset:any, price:any, interval:any, subsidy:any, amount:any, expiryBlock:any
  ) => {
    const sellerPubKey =  (Pact.crypto.restoreKeyPairFromSecretKey(sellerPrivKey) as any).publicKey
    console.log(Number.parseFloat(amount)+ .0)
    const offer:any= await Pact.fetch.send(
      {
        pactCode: `(${hftAPI.contractAddress}.sale "${tokenId}" "${sellerAccount}" 1.0 ${expiryBlock})`,
        networkId: 'testnet04',
        keyPairs: [{
          //EXCHANGE ACCOUNT KEYS
          //  PLEASE KEEP SAFE
          publicKey: sellerPubKey, //Signing PubK
          secretKey: sellerPrivKey,//signing secret key
          clist: [
            //capability for gas
            {
              name: `coin.GAS`,
              args: []
            },{
              name: `${hftAPI.contractAddress}.OFFER`,
              args: [tokenId, sellerAccount, 1.0, { int:expiryBlock }]
            }
          ]
          }
        ],
        meta: Pact.lang.mkMeta(sellerAccount as string, "1" , 0.000001, 100000, creationTime(), 28800),
        envData: {
          quote:{
            "price": parseFloat(Number.parseFloat(price).toFixed(1)),
            "recipient": sellerAccount,
            "recipient-guard": sellerKeyset,
            "designated-buyer":"",
            "designated-buyer-guard":{"keys": ["buyer"], "pred": "keys-all"},
            "renter-subsidy":parseFloat(Number.parseFloat(subsidy).toFixed(2)),
            "rent-interval":parseFloat(Number.parseFloat(interval).toFixed(1))
          }, buyer: "buyer"
        }
      },
      `https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact`
    )
    const reqKey = offer.requestKeys[0]
    return reqKey
  }

  export const buyToken = async(
    buyerAccount:string,
    buyerKeyset: any,
    buyerPrivKey: string,
    ownerAccount:string,
    providerAccount:string,
    price:any,
    expiryBlock:any,
    saleId:string,
    tokenId:string,
    royalty:any
  )=>{
    /**
 * A contCmd to Execute at /send endpoint
 * @typedef {Object} contCmd
 * @property type {string} - type of command - "cont" or "exec", default to "exec"
 * @property pactId {string} - pactId the cont command - required for "cont"
 * @property nonce {string} - nonce value to ensure unique hash - default to current time
 * @property step {number} - the step of the mutli-step transaction - required for "cont"
 * @property proof {string} - JSON of SPV proof, required for cross-chain transfer. See `fetchSPV` below
 * @property rollback {bool} - Indicates if this continuation is a rollback/cancel - required for "cont"
 * @property envData {object} - JSON of data in command - not required
 * @property meta {object} - public meta information, see mkMeta
 * @property networkId {string} network identifier of where the cmd is executed.
 */
    const offer:any= await Pact.fetch.send(
      {
        type:"cont",
        pactId: saleId,
        step:1,
        rollback:false,
        proof:"",
        envData: {
            "buyer":buyerAccount,
            "buyer-guard":buyerKeyset
        },
        networkId: 'testnet04',
        keyPairs: [{
          //EXCHANGE ACCOUNT KEYS
          //  PLEASE KEEP SAFE
          publicKey: buyerKeyset.keys[0], //Signing PubK
          secretKey: buyerPrivKey,//signing secret key
          clist: [
            //capability for gas
            {
              name: `coin.GAS`,
              args: []
            },{
              name: `${hftAPI.contractAddress}.BUY`,
              args: ["mike-wework-subscription", "mike-subscriber","mike-renter", 1.0, { int:expiryBlock }, saleId]
            },
            {
              name: "coin.TRANSFER",
              args: [buyerAccount, providerAccount, royalty]
            },
            {
              name: "coin.TRANSFER",
              args: [buyerAccount, ownerAccount, price]
            }
          ]
          }
        ],
        meta: Pact.lang.mkMeta(buyerAccount as string, "1" , 0.000001, 100000, creationTime(), 28800)
      },
      `https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact`
    )
    const reqKey = offer.requestKeys[0]
    console.log(reqKey)
  }