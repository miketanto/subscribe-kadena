import {
  providers, utils, Contract,
} from 'ethers'

import { Skills } from '../models'
import HHContract from '../contracts/summit/mumbai/hardhat_contracts.json'

const {
  address: MUMBAI_SKILLS_ADDRESS,
  abi: MUMBAI_SKILLS_ABI,
} = HHContract['80001'].mumbai.contracts.SkillsWallet

const provider = new providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')

const contract = new Contract(MUMBAI_SKILLS_ADDRESS, MUMBAI_SKILLS_ABI, provider);
(async () => {
  // await Skills.sync()

  const pendingSkills = await Skills.findAll({
    where: { status: 'pending' },
    raw: true,
  })

  const pendingSkillsByTxHash = {}

  pendingSkills.forEach((skill) => {
    const { tx_hash: txHash } = skill
    pendingSkillsByTxHash[txHash] = skill
  })

  contract.on('Create', async (...args) => {
    const event = args[args.length - 1] // event metadata is the last one
    const [credentialer, credentialId, time] = args

    console.log(event)

    const txHash = event.transactionHash

    await Skills.update({
      token_id: credentialId.toString(), // BN
      status: 'active',
    }, {
      where: { tx_hash: txHash },
    })

    delete pendingSkillsByTxHash[txHash]
  })
})()
