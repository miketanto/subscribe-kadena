import dotenv from 'dotenv'
import Joi from 'joi'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

import { IS_PRODUCTION } from '../utils/constants'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envFileName = IS_PRODUCTION ? '.env' : '.env.dev'
// This config must come before all other imports that rely on process.env
//  and any variables that use process.env (other than IS_PRODUCTION)
dotenv.config({ path: path.join(__dirname, `../../${envFileName}`) })

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),

    WEB3_NODE_URL: Joi.string().required(),
    IPFS_BASE_URL: Joi.string().required(),

    POLYGON_DEPLOYER_KEY: Joi.string().required(),
    MUMBAI_DEPLOYER_KEY: Joi.string().required(),

    RP_ADDRESS: Joi.string().required(),
    RP_PASSWORD: Joi.string().required(),
    RP_PRIVATE_KEY: Joi.string().required(),

    AAD_CLIENT_ID: Joi.string().required(),
    AAD_CLIENT_SECRET: Joi.string().required(),
    AAD_CLIENT_SECRET_ID: Joi.string().required(),
    AAD_ID_META: Joi.string().required(),
    AAD_REDIRECT_URL: Joi.string().required(),

    DB_HOST: Joi.string().required().default('localhost'),
    DB_NAME: Joi.string().required().description('Database name to connect'),
    DB_PASSWORD: Joi.string().optional().default(''), // .required(),
    DB_PORT: Joi.string().required(),
    DB_USER: Joi.string().required(),

    SESSION_SECRET: Joi.string().required().description('Secret key for protecting sessions'),
  })
  .unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,

  web3NodeUrl: envVars.WEB3_NODE_URL,
  ipfsBaseUrl: envVars.IPFS_BASE_URL,

  privateKeys: {
    polygon: envVars.POLYGON_DEPLOYER_KEY,
    mumbai: envVars.MUMBAI_DEPLOYER_KEY,
  },

  replenish: {
    address: envVars.RP_ADDRESS,
    privateKey: envVars.RP_PRIVATE_KEY,
    password: envVars.RP_PASSWORD,
  },

  // Microsoft Azure Active Directory (AAD) using OAuth2 & OpenID
  aad: {
    identityMetadata: envVars.AAD_ID_META,
    clientID: envVars.AAD_CLIENT_ID,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: envVars.AAD_REDIRECT_URL,
    allowHttpForRedirectUrl: true, // switch to false once moved to HTTPS
    clientSecret: envVars.AAD_CLIENT_SECRET,
    validateIssuer: false,
    issuer: null,
    passReqToCallback: false,
    // scope: ['profile', 'offline_access', 'https://graph.microsoft.com/mail.read'],
    scope: ['profile'],
    // OPTIONAL parameters
    useCookieInsteadOfSession: false, // recommended: use sessions instead of cookies
  },

  db: {
    dbname: envVars.DB_NAME,
    dialect: 'postgres',
    host: envVars.DB_HOST,
    password: envVars.DB_PASSWORD,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    sequelize_port: envVars.DB_PORT,
    user: envVars.DB_USER,
  },

  sessionSecret: envVars.SESSION_SECRET,
}
