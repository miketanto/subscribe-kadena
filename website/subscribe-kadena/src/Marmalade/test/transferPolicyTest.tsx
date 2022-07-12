import {Wallet,Policy,Uri,Datum, Manifest, TypeWrapper} from '../types/customTypes'
import Marmalade from '../index'
import {host} from '../config/config'
import { transferableSubscribeAPI, transferableSubscribeSchema } from '../constants/transferableSubscribeApi'
import Pact from '../pact-lang-api/pact-lang-api'
import { extendToken, extendTokenFull, extendTokenSignature, withdrawToken, withdrawTokenSignature } from '../api/tokenFunctions'
import { mikeHuluSubInfo } from '../constants/tokenInfo'

const providerPrivKey = "9fb09d4a2d472b78e6e7c9965132756d45af6a14c3e78d311ef4af0cf63f5db1"
const buyerPrivKey = "b48fe54b78709be365b16cf34cab8c1325eb8ab900d4624589fac3706ca56881"
const providerWallet:Wallet = {
    signingKey: "9c5270f49edcf594dfe130db95355ed8414ba6ec706e793897b980e24af6bfb9",
    networkId: "testnet04",
    gasPrice: 0.000001,
    gasLimit: 100000,
    accountName: "mike-provider"
}

const buyerWallet:Wallet = {
    signingKey: "805b8b00155406f7d3546f20c61066be8dbdc410aac7285607ea4f7e2db78567",
    networkId: "testnet04",
    gasPrice: 0.000001,
    gasLimit: 100000,
    accountName: "mike-subscriber"
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
    "keys":["9c5270f49edcf594dfe130db95355ed8414ba6ec706e793897b980e24af6bfb9"]
}

const buyerKeyset = {
    "pred":"keys-all",
    "keys":["805b8b00155406f7d3546f20c61066be8dbdc410aac7285607ea4f7e2db78567"]
}

export const testCreateToken = async ()=>{
    const testDatumUri:TypeWrapper = await Marmalade.manifest.createUri("contract.schema","pact:schema")
    const testManifestUri:TypeWrapper = await Marmalade.manifest.createUri("image/jpeg;base64", "SOMEIMGDATA")
    const testDatum:TypeWrapper = await Marmalade.manifest.createDatum((testDatumUri.value as Uri), testDatumInner)
    const testManifest:TypeWrapper = await Marmalade.manifest.createManifest(testManifestUri.value as Uri, [(testDatum.value as Datum)])
    const transferableSubscribeParams= {
        "manifest": (testManifest.value as Manifest),
        "provider-guard":providerKeyset, 
        "provider-account":"mike-provider",
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
    const createTokenReqKey = Marmalade.token.createToken(1,"mike-hulu-subscription",transferableSubscribePolicy,transferableSubscribeParams,providerPrivKey,"mike-provider")
    console.log(createTokenReqKey)
}

export const testMintToken = ()=>{
    const mintTokenSigData = Marmalade.token.mintToken("mike-subscriber",buyerPrivKey,"mike-hulu-subscription",1.0,buyerKeyset,1.0,"mike-provider")
    console.log(mintTokenSigData)
}

export const testWithdrawToken = ()=>{
    const mintTokenSigData = withdrawToken("mike-provider",buyerPrivKey,"mike-subscriber","mike-hulu-subscription",providerKeyset,1.0)
    console.log(mintTokenSigData)
}

export const testExtendToken = ()=>{
    const mintTokenSigData = extendToken("mike-hulu-subscription",mikeHuluSubInfo,buyerPrivKey,providerPrivKey,1.0,"mike-provider", "mike-subscriber")
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