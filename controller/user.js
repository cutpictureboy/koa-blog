class UserController {
  async register (ctx, next) {
    await ctx.service.userService.register(ctx)
    await next()
  }

  async login (ctx, next) {
    await ctx.service.userService.login(ctx)
    await next()
  }

  async query (ctx, next) {
    await ctx.service.userService.query(ctx)
    await next()
  }

  async retrieve (ctx, next) {
    await ctx.service.userService.retrieve(ctx)
    await next()
  }

  async password (ctx, next) {
    await ctx.service.userService.password(ctx)
    await next()
  }
}

module.exports = new UserController()
