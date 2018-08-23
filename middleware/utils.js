
const crypto = require('crypto')
const { hmacKay } = require(`${process.rootDir}/config/key.config`)

class Utils {
  /**
   * 生成hmac密钥
   * @param {String} str
   */
  createHamc (str) {
    if (typeof str === 'string') {
      let hash = crypto.createHmac('sha256', hmacKay)
      hash.update(str)
      let result = hash.digest('hex')
      hash = null
      return result
    } else {
      throw Error('加密数据格式不正确')
    }
  }
}

const utils = new Utils()

module.exports = async (ctx, next) => {
  ctx.utils = utils
  await next()
}
