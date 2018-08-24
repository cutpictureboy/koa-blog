const redis = require('redis')
const config = require('../config/key.config')

const client = redis.createClient()
client.on('error', error => {
  console.log('ERR' + error)
})

/**
 * 在redis中设置key value
 * @param {string} name
 * @param {string} value
 */
async function set (name, value) {
  await client.hset(config.redis, name, value)
}

/**
 * 在redis中获取key value
 * @param {string} name
 * @param {string} value
 */
async function get (name, value) {
  let data = await client.hget(config.redis, name)
  return data
}

/**
 * 在redis中获取key value
 * @param {string} name
 * @param {string} value
 */
async function del (name, value) {
  await client.hdel(config.redis, name)
}

module.exports = async (ctx, next) => {
  ctx.redis = {
    get,
    set,
    del
  }
  await next()
}
