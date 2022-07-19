import compression from 'compression'
import cors from 'cors'
import session from 'cookie-session'
import express from 'express'
import { auth as openIDAuth } from 'express-openid-connect'
import helmet from 'helmet'
import httpStatus from 'http-status'
import xss from 'xss-clean'

import {
  morgan, envVars, passport as passportHelper,
} from './config'
import { errorConverter, errorHandler } from './middlewares/error'
import sequelize from './models'
import routes from './routes'
import { ApiError, logger } from './utils'

const app = express()

if (envVars.env !== 'test') {
  app.use(morgan.successHandler)
  app.use(morgan.errorHandler)
}

// sync database (create tables if not exist)
sequelize.sync({force:true})

// set security HTTP headers
app.use(helmet())

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

// sanitize request data
app.use(xss())

// gzip compression
app.use(compression())

// enable cors
app.use(cors())
app.options('*', cors())

// use passport for Microsoft AAD OAuth (OpenID Connect)
// for Auth0 stuff
// all routes are by default not protected. To protect, use requiresAuth() middleware
app.use(openIDAuth({
  authRequired: false,
  // auth0Logout: true,
  issuerBaseURL: 'https://dev-qdoaepgh.us.auth0.com',
  baseURL: envVars.env === 'development' ? 'http://localhost:3000' : 'https://iblockcore.com',
  clientID: 'ATIWCOwYIsDrBcsdqAiBq3V03sUhd7aN',
  secret: 'LONG_RANDOM_STRING_OF_SECRET',
  idpLogout: true,
  // scope: 'openid profile email',
}))

// use cookie helper
// app.use(cookieParser(envVars.cookieSecret))

// use session helper (for persistent session over server)
app.use(session({ secret: envVars.sessionSecret, resave: true, saveUninitialized: false }))

// v1 api routes (==> api.iblockcore.com/)
app.use('/', routes)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Requested path not found'))
})

// convert error to ApiError, if needed
app.use(errorConverter)

// handle error
app.use(errorHandler)

//
// Start app server
//
const server = app.listen(envVars.port || 3000, () => {
  logger.info(`Listening to port ${envVars.port}`)
})

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error) => {
  console.log(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)