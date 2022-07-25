import httpStatus from 'http-status'

import { envVars } from '../config'
import { ApiError, logger } from '../utils'

export function errorConverter(err, req, res, next) {
  let error = err
  console.log(err)
  if (!error) return next()

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR
    let message = httpStatus[statusCode]

    if (error.message) {
      if (error.message.startsWith('TypeError: Cannot read properties of undefined')) {
        statusCode = httpStatus.BAD_REQUEST
        message = httpStatus[statusCode]
      } else {
        message = error.message
      }
    }

    error = new ApiError(statusCode, message, false, err.stack)
  }
  next(error)
}

export function errorHandler(err, req, res, next) {
  // console.log(err)
  if (!err) return next() // skip to final responder if not error

  let { statusCode, message } = err
  if (envVars.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
  }

  res.locals.errorMessage = err.message

  const resJson = {
    // TODO: return unified error code based on message type
    // eg. Invalid Firebase ID token => 'invalid-fb-id-token'
    error: message,
    status: 'error',
    msg: message,
    payload: {},
    // show on dev only
    ...(envVars.env === 'development' && { DEV_NOTE: 'STACK is only shown in NODE_ENV=development' }),
    ...(envVars.env === 'development' && { stack: err.stack }),
  }

  if (envVars.env === 'development') {
    logger.error(err)
  }

  res.status(statusCode).send(resJson)
}
