const Web3 = require('web3')

/**
 * Promisifies the native batch request
 */
class PromisedBatchRequest {
  constructor(web3) {
    this.web3 = web3
    this.reset()
  }

  /**
   * Add a request to the batch
   * @param _request Must be a .request call (e.g. web3.eth.getBlock.request)
   * @param params Params passed to the normal call in order, separated by comma
   */
  add(_request, ...params) {
    // eslint-disable-next-line max-len
    const request = new Promise((resolve, reject) => this.batch.add(_request.call(null, ...params, (err, data) => (err ? reject(err) : resolve(data)))))
    this.requests.push(request)
  }

  async execute() {
    this.batch.execute()
    return Promise.all(this.requests)
  }

  reset() {
    this.batch = new this.web3.BatchRequest()
    this.requests = []
  }
}

const url = 'http://141.142.222.46:80';

(async () => {
  const web3 = new Web3(url)

  const latestBlockNumber = await web3.eth.getBlockNumber()
  const lastN = 10

  console.log(await web3.version)
  console.log(latestBlockNumber)

  const batch = new PromisedBatchRequest(web3)
  for (let i = 0; i < lastN; i++) {
    batch.add(web3.eth.getBlock.request, latestBlockNumber - i)
  }
  const receipts = await batch.execute()
  console.log(receipts, receipts.length)
})()
