const Sequelize = require('sequelize')
const dbConfig = require('../config/db.config')

const {
  database,
  username,
  password,
  host,
  dialect,
  pool
} = dbConfig

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  pool,
  logging: false
})

function defineModel (name, attrs, options = {}) {
  return sequelize.define(name, attrs, options)
}

module.exports = defineModel
