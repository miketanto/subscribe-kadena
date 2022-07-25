import {networkId, chainId, host, gasStationName, creationTime, globalConfig } from '../config/config.js' //Might move to marmalade passable config


export const transferableSubscribeAPI = {
    contractName: "transferable-subscribe-policy",
    gasStationName: gasStationName,
    namespace: "free",
    contractAddress: "free.transferable-subscribe-policy",
    gasStationAddress: `free.${gasStationName}`,
    explorerURL: `https://explorer.chainweb.com/${networkId.slice(0, -2)}`,
    constants: {},
    meta: {
      networkId: networkId,
      chainId: chainId,
      host: host,
      creationTime: creationTime,
      //gas price at lowest possible denomination
      gasPrice: globalConfig.gasPrice,
      //high gas limit for tx
      gasLimit: globalConfig.gasLimit,
      //time a tx lives in mempool since creationTime
      ttl: 28800,
      //sender === gas payer of the transaction
      //  set to our gas station account defined in memory-wall-gas-station.pact
      sender: "mw-free-gas",
      //nonce here doesnt matter since the tx will never have the same hash
      nonce: "some nonce that doesnt matter",
    },
  };

  export const transferableSubscribeSchema = {
    "manifest": "Manifest",
    "provider-guard":"Object", 
    "provider-account":"String",
    "owner-guard":"Object",
    "renter-guard":"Object",
    "provider-royalty":"Number",
    "owner-royalty":"Number",
    "trial-period":"Number",
    "grace-period":"Number",
    "pausable":"Boolean",
    "expiry-time":"Time",
    "interval":"Number",
    "first-start-time":"Time", 
    "min-amount":"Number", 
    "max-supply":"Number"
  }