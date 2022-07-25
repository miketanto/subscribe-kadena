import { utils, Contract, Wallet } from 'ethers'

/**
 * Gets HD Data of wallet with `m/44'/60'/0'/0/${i}`
 * @param wallet
 * @param [accountIdxStart]
 * @param [count]
 * @return {HDNode[]}
 */
export function getWalletData(wallet, accountIdxStart = 0, count = 1) {
  const data = []
  for (let i = accountIdxStart; i < accountIdxStart + count; i++) {
    const hdAddressData = utils.HDNode.fromMnemonic(wallet.mnemonic.phrase).derivePath(`m/44'/60'/0'/0/${i}`)
    data.push(hdAddressData)
  }
  return data
}

/**
 * Gets addresses from wallet
 * @param wallet
 * @param accountIdxStart
 * @param count
 * @return {string[]}
 */
export function getAddressOfWallet(wallet, accountIdxStart = 0, count = 1) {
  const walletData = getWalletData(wallet, accountIdxStart, count)
  return walletData.map((data) => data.address)
}

/**
 * @param wallet
 * @param provider
 * @param target `skills` or `nft` to pick address of wallet
 * @return {Wallet}
 */
export function getSignerFromWallet(wallet, provider, target) {
  let accountIndex
  switch (target) {
    case 'nft':
    case 'marketplace':
      // second index is skills wallet
      accountIndex = 1
      break
    case 'skills':
    case 'skills_wallet':
    default:
      // first index is skills wallet
      accountIndex = 0
      break
  }

  const fromWallet = getWalletData(wallet, accountIndex, 1)[0]

  // create & return signer from wallet
  return new Wallet(fromWallet, provider)
}

/**
 * Create a writable Contract given a signer
 * @param signer
 * @param contractAddress Contract Address
 * @param contractABI Contract ABI
 * @return {Contract}
 */
export function connectContractWithSigner(signer, contractAddress, contractABI) {
  // connect to contract with that signer (calls on behalf of signer)
  return new Contract(contractAddress, contractABI, signer)
}

/**
 * Create a writable Contract given a wallet
 * @param wallet
 * @param provider
 * @param target `skills` or `nft` to pick address of wallet
 * @param contractAddress Contract Address
 * @param contractABI Contract ABI
 * @return {{contract: Contract, signer: Wallet}}
 */
export function connectContractWithWallet(wallet, provider, target, contractAddress, contractABI) {
  // connect to contract with that signer (calls on behalf of signer)
  const signer = getSignerFromWallet(wallet, provider, target)
  const contract = connectContractWithSigner(signer, contractAddress, contractABI)
  return { contract, signer }
}
