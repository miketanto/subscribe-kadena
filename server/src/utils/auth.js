import httpStatus from 'http-status'

import ApiError from './ApiError'

/**
 * Extract Bearer token from req.header
 * @param req
 */
// ** express makes everything lowercase (authorization, but NOT Bearer)
// eslint-disable-next-line import/prefer-default-export
export function getBearerTokenFromHeaders(req) {
  const authHeader = req.headers.authorization

  if (!authHeader) throw new ApiError(httpStatus.BAD_REQUEST, 'Missing authorization header')
  if (!authHeader.startsWith('Bearer ')) throw new ApiError(httpStatus.BAD_REQUEST, 'Missing bearer token')

  const jwtToken = authHeader.substring(7, authHeader.length)
  if (jwtToken.trim() === '') throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid bearer token')

  return jwtToken
}
