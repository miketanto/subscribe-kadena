import Joi from 'joi'
import httpStatus from 'http-status'

import { ApiError, pick } from '../utils'

export default function validate(schema) {
  return (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body'])
    const object = pick(req, Object.keys(validSchema))
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: 'key' }, abortEarly: false })
      .validate(object)

    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ')
      throw new ApiError(httpStatus.BAD_REQUEST, errorMessage)
    }
    Object.assign(req, value)
    return next()
  }
}
