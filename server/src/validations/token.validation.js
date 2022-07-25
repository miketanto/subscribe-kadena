import Joi from 'joi'

import { addressFilter } from './helper'

export const get = {
  query: {
    id: Joi.number().optional(),
    token_id: Joi.string().optional(),
    owner: Joi.string().optional(),
    subscription_id: Joi.number().optional()
  },
}

export const list = {
  query: {
    id: Joi.string().required(),
  },
  body: {
    rent_interval: Joi.number().required(),
    renter_subsidy:Joi.number().default(0.0)
  },
}

export const buy = {
  query: {
    id: Joi.number().required(),
  },
}

export const deleter = {
  query: {
    id: Joi.number().required(),
  },
}

export const create = {
  body: {
    token_id: Joi.string().required(),
    manifest: Joi.object().required(),
    owner: Joi.string().required(),
    provider:Joi.string().required(),
    owner_guard: Joi.object().required(),
    provider_guard: Joi.object().required(),
    interval: Joi.number().required(),
    tx_raw_cmd: Joi.string().required(),
    withdrawal_sig: Joi.object().required(),
    subscription_id: Joi.number().required()
  }
}

export const updater = {
  body: {
    market_id: Joi.number().optional(), // Might have to make some params invalid so that it doesn't change the system
    name: Joi.string().optional(),
    image_url: Joi.string().optional(),
    symbol: Joi.string().optional(),
    asset_contract: Joi.string().optional().custom(addressFilter),
    collection_id: Joi.number().optional(),
    quantity: Joi.number().optional(),
    token_id: Joi.number().optional(),
    likes: Joi.number().optional(),
  },
}
