const Web3 = require('web3');
(async () => {
    const web3 = new Web3('http://141.142.222.46:80')
    const data = await web3.eth.getBlock('latest')
    console.log(data)
})()
