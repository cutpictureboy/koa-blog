const Sequelize = require('sequelize')
const defineModel = require('../core/db')

const { STRING } = Sequelize
const userModel = defineModel('user', {
  username: {
    type: STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: STRING,
    allowNull: false
  },
  email: {
    type: STRING,
    allowNull: false
  }
}, {
  initialAutoIncrement: 1000000
})
userModel.sync(false)

/**
 * 插入一条用户数据
 * @param {any} param
 */
async function createOneUser (param) {
  const { username, password, email } = param
  const result = await userModel.create({
    username,
    password,
    email
  })
  return result
}

/**
 * 通过用户名查找数量
 * @param {string} username
 */
async function findUserCountByUsername (username) {
  const result = await userModel.count({
    where: {
      username: username
    }
  })
  return result
}

/**
 * 通过用户名查找用户信息
 * @param {string} username
 */
async function findOneUserByUsername (username) {
  const result = await userModel.findOne({
    where: {
      username: username
    }
  })
  return result
}

module.exports = {
  createOneUser,
  findOneUserByUsername,
  findUserCountByUsername
}
