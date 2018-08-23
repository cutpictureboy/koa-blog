const success = function (options = {}) {
  this.body = Object.assign({}, {
    code: 200,
    type: 'success',
    message: ''
  }, options)
  return this.body
}

const error = function (options = {}) {
  this.body = Object.assign({}, {
    code: 200,
    type: 'fail',
    message: '服务器错误'
  }, options)
  return this.body
}

module.exports = async (ctx, next) => {
  ctx.success = success
  ctx.error = error
  await next()
}
