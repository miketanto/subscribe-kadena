import { constants, utils } from 'ethers'

export function addressFilter(value, helper) {
  if (!utils.isAddress(value) || value === constants.AddressZero) return helper.message('Address must be valid and not be a zero address')
  return value
}
