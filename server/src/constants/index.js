import { providers } from 'ethers'

import envVars from '../config/env-vars'

export const provider = new providers.JsonRpcProvider(envVars.web3NodeUrl)
