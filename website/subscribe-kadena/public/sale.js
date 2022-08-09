export const saleTokenSignature = (
  wallet:Wallet,
  seller:string,
  amount:string|Number,
  price:string|Number, 
  recipient:string, 
  recipientGrd:Guard|string, 
  tokenId:string, 
  timeLimit:Number,
  fungibleTokenContract:string)=>{
        let result
        const parsedPrice = typeof(price) === "string"? Number.parseFloat(price):price
        const parsedAmount = typeof(amount) === "string"? Number.parseFloat(amount):amount
        const parsedGuard = typeof(recipientGrd) === "string"? JSON.parse(recipientGrd):recipientGrd

        const JSONSigBuilder=
        {
          networkId: "string network Id",
          payload: {
            exec: {
              data: "object of transaction environment data e.g. parameters for inner functions",
              code: "string of transaction code"
            }
          },
          signers: [
            pubKey: "string 16 bit encoded public key",
            clist:[
              /* Array of optional managed capabilities */
              {
                name:"string name of managed capability e.g.coin.TRANSFER",
                args:["array of arguments for corresponding managed capability"]
              }
            ]
          ],
          meta: {
            /*Transaction details metadata*/
            chainId: "String denoting target chain id",
            sender: "String denoting sender account id",
            gasLimit: "integer gas limit",
            gasPrice: "double gas price",
            ttl: "integer time-to-live value"
        },
          nonce: "string nonce to ensure unique hash"
        };


        const JSONSigBuilderCont=
        {
          networkId: "string network Id",
          payload: {
            cont: {
              proof: "string spv proof of continuation (optional, cross-chain only)",
              pactId: "string id of pact",
              step: "integer step of the pact that will be executed",
              rollback: "boolean of whether step is a rollback",
              data: "object of transaction environment data e.g. parameters for inner functions",
            }
          },
          signers: [
            pubKey: "string 16 bit encoded public key",
            clist:[
              /* Array of optional managed capabilities */
              {
                name:"string name of managed capability e.g.coin.TRANSFER",
                args:["array of arguments for corresponding managed capability"]
              }
            ]
          ],
          meta: {
            /*Transaction details metadata*/
            chainId: "String denoting target chain id",
            sender: "String denoting sender account id",
            gasLimit: "integer gas limit",
            gasPrice: "double gas price",
            ttl: "integer time-to-live value"
        },
          nonce: "string nonce to ensure unique hash"
        };


      const directRequestFormat = 
      {
        cmds:[
          {
            hash:"string hash of transaction",
            sigs : {
              /*Object that acts as array of pubkey -> it signature*/
              /*sigs need to be in order with the order that respective pubkeys appear in clist*/
              "16BitPubkey":"signature for capability",
            },
            cmd: "stringified Json of Execution Command JSON Format"
          }
        ]
      }
      ;
       
        result = signExecHftCommand(wallet,
          `(${hftAPI.contractAddress}.sale "${tokenId}" "${seller}" (read-decimal 'amount) (read-integer 'timeout))`,
          { amount: amount,
            timeout: timeLimit,
            quote
          },
          [SigData.mkCap(`${hftAPI.contractAddress}.OFFER`,[tokenId, seller, parsedAmount , {int: timeLimit}])]
        );
        return result
}


const marmacoinOffer = {
  "payload":{
    "exec":
    {"data":
      {"amount":1,
      "timeout":2299000,
      "quote": {
        "price":2,
        "recipient":"marma-provider",
        "recipient-guard":{"pred":"keys-all","keys":["9c5270f49edcf594dfe130db95355ed8414ba6ec706e793897b980e24af6bfb9"]},
        "fungible":{"refName":{"namespace":null,"name":"coin"},"refSpec":[{"namespace":null,"name":"fungible-v2"}]}
      }
    },
    "code":`(marmalade.ledger.sale "MARMACOIN" "marma-provider" (read-decimal 'amount) (read-integer 'timeout))`
  }},
  "networkId":"testnet04",
  "signers":
  [{
      "pubKey":"9c5270f49edcf594dfe130db95355ed8414ba6ec706e793897b980e24af6bfb9",
      "clist":[
        {"name":"marmalade.ledger.OFFER","args":[`MARMACOIN`,'marma-provider',1,{"int":2299000}]},
        {"name":"coin.GAS","args":[]}
      ]
    }],
  "meta":{"creationTime":1659628246,"ttl":28800,"gasLimit":100000,"chainId":"1","gasPrice":0.000001,"sender":"marma-provider"},
  "nonce":"random nonce to ensure unique hash"
  }

  const withdrawalJSONExample= {
    "networkId":"testnet04",
    "payload":{
      "cont":{
        "pactId":"marmacoin pact id",
        "step":0,
        "rollback":true,
        "data":{},
        "proof":null}},
    "signers":[
      {"clist":[{"name":"coin.GAS","args":[]}],
      "pubKey":"9c5270f49edcf594dfe130db95355ed8414ba6ec706e793897b980e24af6bfb9"}
      ],
    "meta":{"creationTime":1659633501,"ttl":28800,"gasLimit":100000,"chainId":"1","gasPrice":0.000001,"sender":"marma-provider"},
    "nonce":"2022-08-04T17:18:35.509Z"
    }




    const buyTokenJSONOutline = {
    "networkId":"networkId",
    "payload":{
      "cont":{
        "pactId":"marmacoin sale pact id",
        "step":1,
        "rollback":false,
        "data":{
          "buyer":"token buyer account name",
          "buyer-guard":{"pred":"keys-all","keys":["token buyer account public key"]}
        },
        "proof":null}
      },
    "signers":
      [
        {"clist":[
          {"name":"marmalade.ledger.BUY","args":["MARMACOIN","token seller account","token buyer account",1,{"int":"timeout block"},"marmacoin sale pact id"]},
          {"name":"coin.TRANSFER","args":["token buyer account","token seller account","token price"]},
          {"name":"coin.GAS","args":[]}
        ],
        "pubKey":"token buyer account public key"}
      ],
      "meta":
      {"creationTime":"integer creation time",
      "ttl":"integer time-to-live",
      "gasLimit":"integer gas limit",
      "chainId":"string of chain id number",
      "gasPrice":"double of gas price",
      "sender":"string of transaction sender account"},
      "nonce":"random nonce to ensure unique hash",
    }

