import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { transports, createLogger, format } from 'winston'

import { IS_PRODUCTION } from './constants'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const serviceName = IS_PRODUCTION ? 'api' : 'api-dev'
const logger = createLogger({
  level: 'info',
  format: format.combine(
    // format.errors({ stack: true }),
    format.timestamp(),
    format.json(),
  ),
  defaultMeta: { service: serviceName },
  transports: [
    new transports.Console({ format: format.simple() }),
    new transports.File({ filename: path.join(__dirname, '../../logs/error.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, '../../logs/combined.log') }),
  ],
})

export default logger
