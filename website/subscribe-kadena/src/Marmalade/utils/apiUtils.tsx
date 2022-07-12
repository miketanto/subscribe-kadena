import { hftAPI } from '../constants/hftApi'
import {ModuleApi, SigExecData,Wallet} from '../types/customTypes'
import { addGasCap, autoCreationTime, MetaData } from './Pact.SigBuilder'
import {SigData} from './Pact.SigBuilder'
import Pact from '../pact-lang-api/pact-lang-api'


export const makeApiMeta = (api:ModuleApi)=>{
    return (Pact.lang.mkMeta(
        api.meta.sender,
        api.meta.chainId,
        (api.meta.gasPrice as number),
        (api.meta.gasLimit as number),
        api.meta.creationTime(),
        (api.meta.ttl as number)
      ))
}

export const signExecHftCommand = (
  wallet:Wallet,
  cmd:string, envData:Object={}, caps:Array<any>=[]
):SigExecData => {
  const {accountName, signingKey, networkId, gasPrice, gasLimit} = wallet;
  const parsedGasPrice = (typeof(gasPrice) === "string")? Number.parseFloat(gasPrice):gasPrice
  console.debug(parsedGasPrice)
  const parsedGasLimit = (typeof(gasLimit)=== "string")? Number.parseFloat(gasLimit):gasLimit
  console.debug(parsedGasLimit)
  const meta = Pact.lang.mkMeta(accountName, hftAPI.meta.chainId, parsedGasPrice as number, parsedGasLimit as number, Number(SigData.util.autoCreationTime()), hftAPI.meta.ttl);
  console.debug(meta)
  const capsWithGas = SigData.util.addGasCap(caps);

  console.log("signExecHftCommand", capsWithGas);

  const signers = SigData.mkSignerCList(signingKey, capsWithGas);
  const cmdJSON = SigData.mkExecPayload(
    cmd,
    signers,
    networkId,
    meta as MetaData,
    {data: envData}
  );
  const execSigData = SigData.mkSigData(cmdJSON);
  console.log(JSON.stringify(execSigData))
  return execSigData
};


export const signContHftCommand = (
  pactId:string,
  step:Number,
  rollback:boolean,
  wallet:Wallet,
  sender:string = "", 
  envData:Object={}, caps:Array<any>=[]
) => {
  const {accountName, signingKey, gasPrice, gasLimit,networkId} = wallet 
  const txSender = sender.length === 0 ? accountName : sender
  const meta = Pact.lang.mkMeta(txSender, hftAPI.meta.chainId, gasPrice as number, gasLimit as number, SigData.util.autoCreationTime(), hftAPI.meta.ttl);
  const capsWithGas = SigData.util.addGasCap(caps);
  console.log("signContHftCommand", capsWithGas);
  const signers = SigData.mkSignerCList(signingKey, capsWithGas);
  const cmdJSON = SigData.mkContPayload(
    pactId,
    step,
    signers,
    networkId,
    meta as MetaData,
    { data: envData,
      rollback: rollback}
  );
  const execSigData = SigData.mkSigData(cmdJSON);
  console.log(JSON.stringify(execSigData))
  return execSigData
};