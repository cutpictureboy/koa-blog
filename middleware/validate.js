const Joi = require('joi')

const validate = async function (data, schema) {
  try {
    await Joi.validate(data, schema)
  } catch (error) {
    this.error({
      message: error.message
    })
    return false
  }
  return true
}

module.exports = async (ctx, next) => {
  ctx.validate = validate
  await next()
}
