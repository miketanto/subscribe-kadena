import { Sequelize } from 'sequelize'

import envVars from '../config/env-vars' // keep this line (not {envVars}) to prevent dependency cycle
import logger from '../utils/logger'

const sequelize = new Sequelize(envVars.db.dbname, envVars.db.user, envVars.db.password, {
  dialect: envVars.db.dialect,
  // dialectOptions: { decimalNumbers: true },
  host: envVars.db.host,
  logger: (msg) => logger.debug(msg),
  logging: false,
  pool: envVars.db.pool,
  port: envVars.db.sequelize_port,
})

export default sequelize
