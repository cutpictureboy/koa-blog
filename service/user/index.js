const userModel = require(`../../model/User`)
const schema = require('./schema')
const mail = require('../../core/mail')

class UserService {
  /**
   * 注册功能
   * @param ctx
   * @returns {Promise<void>}
   */
  async register (ctx) {
    const { query } = ctx.request

    // 对参数输入的参数进行格式校验
    if (!await ctx.validate(query, schema.register)) {
      return
    }

    // 在数据库中检查是否存在该用户
    const isUsernameExit = await this.checkUsernameExit(query.username)
    if (isUsernameExit) {
      ctx.error({
        message: '该用户名已被注册'
      })
      return
    }

    // 对密码进行加密操作
    query.password = ctx.utils.createHamc(query.password)
    await userModel.createOneUser(query)
    ctx.success()
  }

  /**
   * 登陆功能
   * @param ctx
   * @returns {Promise<void>}
   */
  async login (ctx) {
    const { query } = ctx

    // 对参数输入的参数进行格式校验
    if (!await ctx.validate(query, schema.login)) {
      return
    }

    // 根据用户名获取改用户信息
    let { username, password } = query
    const result = await this.getUserInfoByUsername(username)

    // 如果没有查到该用户名 则返回该用户不存在啊
    if (result === null) {
      ctx.error({
        message: '用户名不存在'
      })
      return
    }
    // 对用户的密码进行加密，然后和数据库的密码进行比对
    password = ctx.utils.createHamc(password)
    if (result.password !== password) {
      ctx.error({
        message: '用户密码不正确'
      })
      return
    }

    // 设置用户的session
    await this.setUserSession(ctx)
    ctx.success({
      result: {
        id: result.id,
        email: result.email,
        username: result.username
      }
    })
  }

  /**
   * 查询用户信息
   */
  async query (ctx) {
    const [ username ] = ctx.session.id.split('_')
    const result = await this.getUserInfoByUsername(username)
    ctx.success({
      result: {
        id: result.id,
        email: result.email,
        username: result.username
      }
    })
  }

  async retrieve (ctx) {
    await this.clearUserSession(ctx)
    let options = {
      from: '"cutpicture" <cutpicture@163.com>',
      to: 'huangcheng3@yy.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: '<b>Hello world?</b>' // html body
    }
    mail.postMail(options)
  }

  /**
   * 修改密码
   * @param {Koa.Context} ctx
   */
  async password (ctx) {
    const [ username ] = ctx.session.id.split('_')
    const result = await this.getUserInfoByUsername(username)
    let { oldPassword, newPassword } = ctx.query

    oldPassword = ctx.utils.createHamc(oldPassword)

    // 旧密码输入不正确时返回
    if (oldPassword !== result.password) {
      ctx.error({
        message: '旧密码不正确'
      })
      return
    }
    // 旧密码输入正确时，数据库更新密码，并清除session和redis
    await this.clearUserSession(ctx)
    await userModel.updateUserInfo({
      password: newPassword
    })
    ctx.success()
  }

  /**
   * 检查用户名是否存在
   * @param {String} username
   * @returns {Promise<boolean>}
   */
  async checkUsernameExit (username) {
    const count = await userModel.findUserCountByUsername(username)
    return count > 0
  }

  /**
   * 通过用户名获取该用户的信息
   * @param {String} username
   * @returns {Promise<any>}
   */
  async getUserInfoByUsername (username) {
    const result = await userModel.findOneUserByUsername(username)
    return result
  }

  /**
   * 设置用户session，并将值保存到redis中
   */
  async setUserSession (ctx) {
    const { username } = ctx.query
    const keyword = Math.random().toString(36).substr(2)
    const key = username + '_' + new Date().valueOf() + '_' + keyword
    ctx.session.id = key
    await ctx.redis.set(username, key)
  }

  /**
   * 设置用户session，并将值保存到redis中
   */
  async clearUserSession (ctx) {
    if (ctx.session.id) {
      const [ username ] = ctx.session.id.split('_')
      ctx.session.destroy('id')
      ctx.redis.del(username)
    }
  }
}

module.exports = new UserService()
