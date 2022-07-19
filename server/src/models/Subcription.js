import { Sequelize } from 'sequelize'

import sequelize from './sequelize'

export const Subscriptions = sequelize.define('Subscriptions', {
  subscription_id: {
    type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  name: { type: Sequelize.TEXT, allowNull: false },
  provider: { type: Sequelize.TEXT, allowNull: false },
  provider_guard: { type: Sequelize.JSON, allowNull: false },
  description: { type: Sequelize.TEXT, allowNull: true },
  no_items: { type: Sequelize.INTEGER, allowNull: false },
  floor_price: { type: Sequelize.DOUBLE, allowNull: true },
  volume_traded: { type: Sequelize.DOUBLE, allowNull: true },
  website: { type: Sequelize.TEXT, allowNull: true },
}, {
  timestamps: true,
  underscored: true,
})

export const Tokens = sequelize.define('Tokens', {
  id: { type: Sequelize.BIGINT, allowNull: false, primaryKey: true, autoIncrement: true },
  token_id: { type: Sequelize.TEXT, allowNull: false },
  manifest: {type: Sequelize.JSON, allowNull:false},
  owner: { type: Sequelize.TEXT, allowNull: false },
  provider: { type: Sequelize.TEXT, allowNull: false },
  renter: { type: Sequelize.TEXT, allowNull: true },
  owner_guard: {type : Sequelize.JSON, allowNull:false},
  renter_guard : {type : Sequelize.JSON, allowNull:true},
  provider_guard: {type : Sequelize.JSON, allowNull:false},
  trial_period: {type: Sequelize.INTEGER, allowNull: true},
  grace_period: {type: Sequelize.INTEGER, allowNull:true},
  expiry_time: {type: Sequelize.TEXT, allowNull:false},
  interval:{type: Sequelize.INTEGER, allowNull: true},
  first_start_time: {type: Sequelize.TEXT, allowNull:false},
  min_amount: {type: Sequelize.DOUBLE, allowNull:false},
  max_supply: {type: Sequelize.DOUBLE, allowNull:false},
  tx_raw_cmd: {type: Sequelize.TEXT, allowNull:false},
  withdrawal_sig: {type: Sequelize.JSON, allowNull: false}
}, {
  timestamps: true,
  underscored: true,
})

Tokens.belongsTo(Subscriptions, { foreignKey: 'subscription_id' })

export default sequelize
