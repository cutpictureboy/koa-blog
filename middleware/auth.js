// 不需要检查session的白名单
const whiteList = [
  '/user/login',
  '/user/register',
  '/user/retrieve'
]
/**
 * 检查用户session
 * @returns {Promise<boolean|string>}>}
 */
const checkUserSession = async function (ctx, next) {
  if (ctx.req.headers.referer) {
    ctx.error({
      code: -100,
      message: '非法的请求'
    })
    return
  }
  if (whiteList.includes(ctx.path)) {
    await next()
    return
  }

  if (ctx.session && ctx.session.id) {
    const [username] = ctx.session.id.split('_')
    const record = await ctx.redis.get(username)
    if (record === ctx.session.id) {
      await next()
      return
    }
  }
  notLogin(ctx)
}

/**
 * 用户未登陆
 * @param {Context} ctx
 */
function notLogin (ctx) {
  ctx.error({
    code: 101,
    message: '登录已过期'
  })
}

module.exports = checkUserSession
