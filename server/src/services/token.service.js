import httpStatus from 'http-status'
import axios from 'axios'
import { ethers } from 'ethers'

import envVars from '../config/env-vars'
import { Tokens} from '../models'
import { ApiError } from '../utils'
import { formatToPactDate } from '../utils/dateFormat'

export async function get(options) {
  try {
    const { id, token_id, owner,subscription_id, listed } = options

    let data
    // NFT Item ID is provided, get that NFT
    if (id) data = await Tokens.findOne({ where: { id: id } })
    // NFT Collection ID is provided, get that NFT Collection (of NFTs)
    else if (token_id) data = await Tokens.findOne({ where: { token_id:token_id } })
    // Owner is provided, get that owner's NFT Collection
    else if (owner) data = await Tokens.findAll({ where: { owner: owner } })
    else if (subscription_id) data = await Tokens.findAll({ where: { subscription_id: subscription_id } })
    else if (listed) data = await Tokens.findAll({ where: { listed: true } })
    // Return all Tokens
    else data = await Tokens.findAll()

    return data
  } catch (e) {
    console.log(e)
    if (e instanceof ApiError) throw e
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error')
  }
}

/**
 * Need to make it so that it checks whether it is a recognized account useBearerStrategy
 * Use account from jongwons endpoint
 * caller needs to pass in oid
 */
export async function create(options) {
  try {
   const { token_id, manifest,owner,provider,owner_guard, 
      provider_guard, interval, tx_raw_cmd, withdrawal_sig,
      subscription_id,
      royalty
    } = options

    const intervalInSeconds = Number(interval);
    const first_start_time = formatToPactDate(new Date())
    const expiry_time = formatToPactDate(new Date(new Date().getTime() + (intervalInSeconds*1000)))
      const token = {
        token_id,
        manifest,
        owner,
        owner_guard,
        provider,
        provider_guard,
        interval,
        tx_raw_cmd,
        withdrawal_sig,
        expiry_time,
        first_start_time,
        min_amount:1.0,
        max_supply:1.0,
        subscription_id,
        royalty:royalty, 
        listed:false
        }
    console.log('Created')
    return await Tokens.create(token)
  } catch (e) {
    console.log(e)
    if (e instanceof ApiError) throw e
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error')
  }
}

export async function deleter(options) {
  try {
    const { id } = options
    return await Tokens.destroy({ where: { market_id: id } })
  } catch (e) {
    console.log(e)
    if (e instanceof ApiError) throw e
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error')
  }
}

export async function update(options, NFT) {
  try {
    return await Tokens.update(
      { ...NFT },
      { where: { market_id: options.id } },
    )
  } catch (e) {
    console.log(e)
    if (e instanceof ApiError) throw e
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error')
  }
}


export async function list(options,updateOptions) {
  const {id} = options
  const {rent_interval, renter_subsidy, rent_pact_id, rent_price, offer_expiry_block} = updateOptions
  try {
    return await Tokens.update(
      {
        listed:true,
        rent_interval:rent_interval,
        renter_subsidy:renter_subsidy,
        rent_pact_id:rent_pact_id,
        rent_price: rent_price,
        offer_expiry_block:offer_expiry_block
      },
      { where: { token_id: id } },
    )
  } catch (e) {
    console.log(e)
    if (e instanceof ApiError) throw e
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error')
  }
}

export async function buy(options,withdrawOptions) {
  try {
    const { id } = options
    const {rent_tx_raw_cmd, rent_withdrawal_sig, renter, renter_guard} = withdrawOptions

    
    const data = await Tokens.findOne({
      where: { token_id: id },
    })

    const rentExpiry = new Date(new Date().getTime() 
    + (data.rent_interval*1000)).toISOString().slice(0,19).concat('Z')

    return await Tokens.update(
      {
        listed: false,
        renter: renter,
        renter_guard:renter_guard,
        rent_expiry:rentExpiry,
        rent_tx_raw_cmd:rent_tx_raw_cmd,
        rent_withdrawal_sig:rent_withdrawal_sig
      },
      {
        where: { token_id: id },
      },
    )
  } catch (e) {
    console.log(e)
    if (e instanceof ApiError) throw e
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error')
  }
}
