const redis = require('redis')
const config = require('../config/key.config')

const client = redis.createClient()
client.on('error', error => {
  console.log('ERR' + error)
})

function set (name, value) {
  return client.hset(config.redis, name, value, redis.print)
}

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
