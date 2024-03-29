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
  interval : {type: Sequelize.INTEGER, allowNull:false},
  royalty: {type: Sequelize.DOUBLE, allowNull:false},
  price: {type:Sequelize.DOUBLE, allowNull:false},
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
  listed : {type: Sequelize.BOOLEAN, allowNull:false},
  rent_interval : {type: Sequelize.INTEGER, allowNull:true},
  rent_expiry: {type:Sequelize.TEXT, allowNull:true},
  renter_subsidy: {type: Sequelize.DOUBLE, allowNull:true},
  rent_price: {type: Sequelize.DOUBLE, allowNull:true},
  rent_pact_id : {type: Sequelize.TEXT, allowNull:true},
  offer_expiry_block : {type: Sequelize.INTEGER, allowNull:true},
  rent_tx_raw_cmd : {type: Sequelize.TEXT, allowNull:true},
  rent_withdrawal_sig : {type:Sequelize.JSON, allowNull:true},
  withdrawal_sig: {type: Sequelize.JSON, allowNull: false},
  royalty: {type: Sequelize.DOUBLE, allowNull:false}
}, {
  timestamps: true,
  underscored: true,
})

Tokens.belongsTo(Subscriptions, { foreignKey: 'subscription_id' })

export default sequelize
