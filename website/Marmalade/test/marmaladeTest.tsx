import {Wallet,Policy,Uri,Datum, Manifest, TypeWrapper} from '../types/customTypes'
import Marmalade from '../index'
import {host} from '../config/config'
const Pact = require("../pact-lang-api/pact-lang-api")

const testWallet:Wallet = {
    signingKey: "e6ee763bd659fb2bb4e1f402f338e4bb374b91434f34d5fd49d85e99a00df9e2",
    networkId: "testnet04",
    gasPrice: 0.000001,
    gasLimit: 100000,
    accountName: "mike.tanto"
}

const testBuyerWallet:Wallet = {
    signingKey: "a8de868a0acb7b38268e81c49799d94328bac783784915be3011516aa7735507",
    networkId: "testnet04",
    gasPrice: 0.000001,
    gasLimit: 100000,
    accountName: "mike.tanto.no2"
}

const testDatumInner = {
    "assetUrl": "https://dna-tokens-test.s3.us-east-2.amazonaws.com/public/thumb_01680428-36db-46c2-b059-fe59f2ca5a4b.jpeg",
    "creationDate": "2022-02-09",
    "title": "Metal Industrial Complex No.1",
    "artistName": "Jamie McGregor Smith",
    "properties": {
      "medium": "Archival Lambda Colour Print",
      "supply": "5",
      "purchaseLocation": "Direct from Artist",
      "recordDate": "2022-02-09",
      "dimensions": "80x60cm",
      "description": "Signed By Artist And Supplied With Printers Certificate Of Authenticity"
    }
  }

const fixedQuotePolicy:Policy = Marmalade.policy.composeDefaultPolicy(false, true)

const testKeyset = {
    "pred":"keys-all",
    "keys":["e6ee763bd659fb2bb4e1f402f338e4bb374b91434f34d5fd49d85e99a00df9e2"]
}

const testRecipientKeyset = {
    "pred":"keys-all",
    "keys":["a8de868a0acb7b38268e81c49799d94328bac783784915be3011516aa7735507"]
}

export const testCreateToken = async ()=>{
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
    const createTokenSigData = Marmalade.token.createTokenSignature(testWallet,fixedQuotePolicy,fqpPolicyParams, "MKOCOIN", 12)
    console.log(createTokenSigData)
}

export const testMintToken = ()=>{
    const mintTokenSigData = Marmalade.token.mintTokenSignature(testWallet,"mike.tanto","MKOCOIN","5",testKeyset)
    console.log(mintTokenSigData)
}

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
}