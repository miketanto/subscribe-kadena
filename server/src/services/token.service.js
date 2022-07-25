import httpStatus from 'http-status'
import axios from 'axios'
import { ethers } from 'ethers'

import envVars from '../config/env-vars'
import { Tokens} from '../models'
import { ApiError } from '../utils'
import { formatToPactDate } from '../utils/dateFormat'

export async function get(options) {
  try {
    const { id, token_id, owner,subscription_id } = options

    let data
    // NFT Item ID is provided, get that NFT
    if (id) data = await Tokens.findOne({ where: { id: id } })
    // NFT Collection ID is provided, get that NFT Collection (of NFTs)
    else if (token_id) data = await Tokens.findOne({ where: { token_id:token_id } })
    // Owner is provided, get that owner's NFT Collection
    else if (owner) data = await Tokens.findAll({ where: { owner: owner } })
    else if (subscription_id) data = await Tokens.findAll({ where: { subscription_id: subscription_id } })
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
      subscription_id
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
        subscription_id
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

export async function list(options, listingOptions) {
  try {
    const { user: { signer }, id } = options
    const { price, useGco, amount } = listingOptions
    // console.log(options)
    // console.log(listingOptions)
    const listing = await listMarketItem(id, signer, price, useGco, amount)
    return await Tokens.update(
      {
        price,
        currency: useGco ? 'GCO' : 'MCO',
        listing_status: true,
      },
      {
        where: { item_id: options.id },
      },
    )
  } catch (e) {
    console.log(e)
    if (e instanceof ApiError) throw e
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error')
  }
}

export async function buy(options) {
  try {
    const { user: { address, signer }, id } = options
    const data = await Tokens.findOne({
      where: { item_id: id },
    })
    const nftData = {
      price: data.price,
      itemId: Number(data.item_id),
      tokenId: Number(data.token_id),
      useGco: (data.currency === 'GCO'),
    }
    const listing = await buyNFT(nftData, signer)
    return await Tokens.update(
      {
        listing_status: false,
        current_owner: address,
      },
      {
        where: { item_id: id },
      },
    )
  } catch (e) {
    console.log(e)
    if (e instanceof ApiError) throw e
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error')
  }
}
