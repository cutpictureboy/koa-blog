const Joi = require('joi')

module.exports.register = Joi.object({
  username: Joi.string().min(3).max(15).required().error(() => new Error('账号不正确')),
  password: Joi.string().min(6).max(15).required().error(() => new Error('密码格式不正确')),
  email: Joi.string().email().required().error(() => new Error('邮箱格式不正确'))
})

module.exports.login = Joi.object({
  username: Joi.string().min(3).max(15).required().error(() => new Error('账号不正确')),
  password: Joi.string().min(6).max(15).required().error(() => new Error('密码格式不正确'))
})
