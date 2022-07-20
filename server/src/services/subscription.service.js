import httpStatus from 'http-status'
import axios from 'axios'
import { ethers } from 'ethers'

import envVars from '../config/env-vars'
import { Subscriptions } from '../models'
import { ApiError } from '../utils'

export async function get(options) {
  try {
    const { subscription_id, provider, name } = options

    let data
    // NFT Item ID is provided, get that NFT
    if (subscription_id) data = await Subscriptions.findOne({ where: { subscription_id: subscription_id } })
    // NFT Collection ID is provided, get that NFT Collection (of NFTs)
    else if (provider) data = await Subscriptions.findAll({ where: { provider: provider } })
    // Owner is provided, get that owner's NFT Collection
    else if (name) data = await Subscriptions.findAll({ where: { current_owner: owner } })
    // Return all Subscriptions
    else data = await Subscriptions.findAll()

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
    const { name, royalty, interval, provider,provider_guard,description, website } = options
    
      const subscription = {
        name,
        provider,
        provider_guard,
        description,
        interval,
        royalty,
        no_items:0,
        floor_price:0.0,
        volume_traded:0.0,
        website
      }
      console.log('Created')
      return await Subscriptions.create(subscription)
      
  } catch (e) {
    console.log(e)
    if (e instanceof ApiError) throw e
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error')
  }
}

export async function deleter(options) {
  try {
    const { id } = options
    return await Assets.destroy({ where: { market_id: id } })
  } catch (e) {
    console.log(e)
    if (e instanceof ApiError) throw e
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error')
  }
}

export async function update(options, NFT) {
  try {
    return await Assets.update(
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
    return await Assets.update(
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
    const data = await Assets.findOne({
      where: { item_id: id },
    })
    const nftData = {
      price: data.price,
      itemId: Number(data.item_id),
      tokenId: Number(data.token_id),
      useGco: (data.currency === 'GCO'),
    }
    const listing = await buyNFT(nftData, signer)
    return await Assets.update(
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
