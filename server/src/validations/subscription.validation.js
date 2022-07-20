import Joi from 'joi'

import { addressFilter } from './helper'

export const get = {
  query: {
    subscription_id: Joi.number().optional(),
    provider: Joi.string().optional(),
    name: Joi.string().optional()
  },
}

export const deleter = {
  query: {
    collection_id: Joi.number().required(),
  },
}

export const create = {
  body: {
    name:Joi.string().required(),
    provider: Joi.string().required(),
    provider_guard: Joi.object().required(),
    description: Joi.string().optional(),
    interval:Joi.number().required(),
    royalty:Joi.number().required(),
    website: Joi.string().optional(),
    price: Joi.number().required()
  },
}

export const update = {
  body: {
    name: Joi.string().required(),
    contract_address: Joi.string().optional().custom(addressFilter),
    description: Joi.string().optional(),
    no_items: Joi.number().optional(),
    no_owners: Joi.number().optional(),
    floor_price: Joi.number().optional(),
    volume_traded: Joi.number().optional(),
    website: Joi.string().optional(),
    discord: Joi.string().optional(),
    instagram: Joi.string().optional(),
    twitter: Joi.string().optional(),
  },
  query: {
    collection_id: Joi.number().required(),
  },
}
