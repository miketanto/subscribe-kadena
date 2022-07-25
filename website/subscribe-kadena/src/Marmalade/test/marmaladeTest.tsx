import {Wallet,Policy,Uri,Datum, Manifest, TypeWrapper} from '../types/customTypes'
import Marmalade from '../index'
import {host} from '../config/config'
import { transferableSubscribeAPI, transferableSubscribeSchema } from '../constants/transferableSubscribeApi'
import Pact from '../pact-lang-api/pact-lang-api'
import { extendToken, extendTokenSignature, withdrawTokenSignature } from '../api/tokenFunctions'
import { mikeHuluSubInfo } from '../constants/tokenInfo'

const providerWallet:Wallet = {
    signingKey: "e6ee763bd659fb2bb4e1f402f338e4bb374b91434f34d5fd49d85e99a00df9e2",
    networkId: "testnet04",
    gasPrice: 0.000001,
    gasLimit: 100000,
    accountName: "mike.tanto"
}

const buyerWallet:Wallet = {
    signingKey: "a8de868a0acb7b38268e81c49799d94328bac783784915be3011516aa7735507",
    networkId: "testnet04",
    gasPrice: 0.000001,
    gasLimit: 100000,
    accountName: "mike.tanto.no2"
}

const testDatumInner = {
    "assetUrl": "https://www.netflix.com",
    "creationDate": "2022-07-11",
    "title": "Mike's Netflix Subscription",
    "providerName": "Netflix Co.ltd"
  }

const transferableSubscribePolicy:Policy = {
    api:transferableSubscribeAPI,
    schema:transferableSubscribeSchema
}

const providerKeyset = {
    "pred":"keys-all",
    "keys":["e6ee763bd659fb2bb4e1f402f338e4bb374b91434f34d5fd49d85e99a00df9e2"]
}

const buyerKeyset = {
    "pred":"keys-all",
    "keys":["a8de868a0acb7b38268e81c49799d94328bac783784915be3011516aa7735507"]
}

export const testCreateToken = async ()=>{
    const testDatumUri:TypeWrapper = await Marmalade.manifest.createUri("contract.schema","pact:schema")
    const testManifestUri:TypeWrapper = await Marmalade.manifest.createUri("image/jpeg;base64", "SOMEIMGDATA")
    const testDatum:TypeWrapper = await Marmalade.manifest.createDatum((testDatumUri.value as Uri), testDatumInner)
    const testManifest:TypeWrapper = await Marmalade.manifest.createManifest(testManifestUri.value as Uri, [(testDatum.value as Datum)])
    const transferableSubscribeParams= {
        "manifest": (testManifest.value as Manifest),
        "provider-guard":providerKeyset, 
        "provider-account":"mike.tanto.no2",
        "owner-guard":buyerKeyset,
        "renter-guard":buyerKeyset,
        "provider-royalty":1.0,
        "owner-royalty":0.0,
        "trial-period":604800,
        "grace-period":604800,
        "pausable":"false",
        "expiry-time":"2022-07-11T11:00:00Z",
        "interval":2592000,
        "first-start-time":"2022-07-10T11:00:00Z", 
        "min-amount":1.0, 
        "max-supply":1.0
    }
    const createTokenSigData = Marmalade.token.createTokenSignature(providerWallet,transferableSubscribePolicy,transferableSubscribeParams, "mike-netflix-subscription", 1)
    console.log(createTokenSigData)
}

export const testMintToken = ()=>{
    const mintTokenSigData = Marmalade.token.mintTokenSignature(buyerWallet,"mike.tanto.no2","mike-netflix-subscription","1.0",buyerKeyset)
    console.log(mintTokenSigData)
}

export const testWithdrawToken = ()=>{
    const mintTokenSigData = withdrawTokenSignature(buyerWallet,"mike.tanto","mike.tanto.no2","mike-netflix-subscription",providerKeyset,"1.0")
    console.log(mintTokenSigData)
}
const borrowerPrivKey = "f2596dbad1747d514ab5fcba72abed76e00164a8034a11456b58652c462ad2c6d844612b9ed6802adb39828be6f73a6fb691ab9c4554eb106202679ed4aa2ea3e6ee763bd659fb2bb4e1f402f338e4bb374b91434f34d5fd49d85e99a00df9e27603a7afb4dc753fbbb58b3e4dc1dd13a3d689bf96d4a4abc5521b9454f078f8"


export const testExtendToken = ()=>{
    const mintTokenSigData = extendToken("mike-netflix-subscription",mikeHuluSubInfo,borrowerPrivKey,borrowerPrivKey,1.0,"mike.tanto", "mike.tanto.no2")
    console.log(mintTokenSigData)
}

/*
export const testOfferToken = ()=>{
    const offerTokenSigData = Marmalade.transaction.saleTokenSignatureAndObject(testWallet,'mike.tanto',1,2,'mike.tanto',testKeyset,"MKOCOIN",2299000,"coin")
    console.log(offerTokenSigData)
}

export const testOfferTokenListen = async (txReqKey:string)=>{
    const res = await Pact.fetch.poll({requestKeys:[txReqKey]}, host);
    return res
}


const saleObj = {"amount": 1,
"buyer": "",
"price": 2,
"saleId": "KmZddf1Kpe42dH8cjhbZVZYWc019SWI48r1fFtOvCuA",
"seller": "mike.tanto",
"timeout": 2299000,
"tokenId": "MKOCOIN"}

export const testBuyToken = ()=>{
   const buyTokenSignature = Marmalade.transaction.buyTokenSignature(testBuyerWallet, "bcEMPxezmsW2R0KMm7TkLh8PCkDf2zUFFZ_QMHdZMnI", "mike.tanto.no2", testRecipientKeyset, saleObj)
   console.log(buyTokenSignature)
}

export const testWithdrawToken = ()=>{
    const withdrawTokenSignature = Marmalade.transaction.withdrawTokenSignature(testWallet,"KmZddf1Kpe42dH8cjhbZVZYWc019SWI48r1fFtOvCuA",saleObj)
}

export const testCreateFull = async ()=>{
    const testDatumUri:TypeWrapper = await Marmalade.manifest.createUri("contract.schema","pact:schema")
    const testManifestUri:TypeWrapper = await Marmalade.manifest.createUri("image/jpeg;base64", "SOMEIMGDATA")
    const testDatum:TypeWrapper = await Marmalade.manifest.createDatum((testDatumUri.value as Uri), testDatumInner)
    const testManifest:TypeWrapper = await Marmalade.manifest.createManifest(testManifestUri.value as Uri, [(testDatum.value as Datum)])
    const fqpPolicyParams= {
        "manifest": (testManifest.value as Manifest),
        "mint-guard": testKeyset,
        "max-supply": "100.0",
        "min-amount": "0.0"
    }
    const secretKey = 'fc9d65426122d5f8ba6ce0de2dc6cf0482d5f23fdc56815d84bbac32d76c2565'
    const createTokenSigData = await Marmalade.token.createToken(12,"MKOCOIN2",secretKey,fixedQuotePolicy,fqpPolicyParams)
    console.log(createTokenSigData)
}*/