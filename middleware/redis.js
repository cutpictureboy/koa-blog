const redis = require('redis')
const config = require(`${process.rootDir}/config/key.config`)

const client = redis.createClient()
client.on('error', error => {
  console.log('ERR' + error)
})

/**
 * 在redis中设置key value
 * @param {string} name
 * @param {string} value
 */
function set (name, value) {
  return client.hset(config.redis, name, value, redis.print)
}

/**
 * 在redis中获取key value
 * @param {string} name
 * @param {string} value
 */
function get (name, value) {
  return new Promise((resolve, reject) => {
    client.hget(config.redis, name, (err, value) => {
      if (err) {
        reject(err)
      }
      resolve(value)
    })
  })
}

module.exports = async (ctx, next) => {
  ctx.redis = {
    get,
    set
  }
  await next()
}
