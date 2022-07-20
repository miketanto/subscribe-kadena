import dotenv from 'dotenv'
import Joi from 'joi'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envFileName = '.env'
// This config must come before all other imports that rely on process.env
//  and any variables that use process.env (other than IS_PRODUCTION)
dotenv.config({ path: path.join(__dirname, `../../${envFileName}`) })

const envVarsSchema = Joi.object()
  .keys({
    SUBSCRIPTION_API_URL: Joi.string().required()
  })
  .unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export default {
  supscriptionApiURL:API_URL
}
