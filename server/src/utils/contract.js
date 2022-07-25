import {
  constants, providers, utils, Contract,
} from 'ethers'

const { AddressZero } = constants
const { JsonRpcSigner, Web3Provider } = providers // imported for types
const { getAddress } = utils

/**
 * Returns the checksummed address if the address is valid, otherwise returns false
 * @param {any} value
 * @return {string | false}
 */
export function isAddress(value) {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

/**
 * Shorten the checksummed version of the input address to have 0x + 4 characters at start and end
 * @param {string} address
 * @param {number} [chars=4]
 * @return {string}
 */
export function shortenAddress(address, chars = 4) {
  const parsed = isAddress(address)
  if (!parsed) throw Error(`Invalid 'address' parameter '${address}'.`)
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

/**
 * @param {Web3Provider} library
 * @param {string} account NOT optional
 * @return {JsonRpcSigner}
 */
function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
/**
 * @param {Web3Provider} library
 * @param {string} [account]
 * @return {Web3Provider | JsonRpcSigner}
 */
function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library
}

/**
 * @param {string} address
 * @param {ContractInterface} ABI
 * @param {Web3Provider} library
 * @param {string} [account]
 * @returns {Contract}
 */
export function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === AddressZero) throw Error(`Invalid 'address' parameter '${address}'.`)
  return new Contract(address, ABI, getProviderOrSigner(library, account))
}

export function getVanillaContract(address, ABI, library) {
  if (!isAddress(address) || address === AddressZero) throw Error(`Invalid 'address' parameter '${address}'.`)
  return new Contract(address, ABI, library)
}
