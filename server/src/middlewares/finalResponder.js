import { catchAsync, deepExtend, getBearerTokenFromHeaders } from '../utils'

/**
 * Final middleware before sending response to user
 * Named the "finalResponder"
 */
export default catchAsync(async (req, res, next) => {
  // skip if route is invalid
  if (!req.route) return next()

  // READ: http://expressjs.com/en/api.html#res.locals
  const passOn = res.locals

  // Unify response syntax
  const resJson = {
    error: null,
    status: 'success',
    msg: '',
    payload: {},
  }

  // check for error
  if (passOn.error) {
    resJson.error = passOn.error
    resJson.status = 'error'
  }

  // bump up `msg` if passed (and delete passOn.msg)
  if (passOn.msg) {
    resJson.msg = passOn.msg
    delete passOn.msg
  }

  // finally, deep extend (to copy everything from passOn to resJson.payload
  resJson.payload = deepExtend(resJson.payload, passOn)

  // Check if access token was renewed silently. If so, return it to the client.
  if (req.headers.auth_renewed) {
    resJson.payload.accessToken = getBearerTokenFromHeaders(req)
  }

  if (resJson.error) res.status(passOn.error.statusCode || 500).send(resJson)
  else res.status(200).send(resJson)
})
