const Router = require('koa-router')
const router = new Router()

module.exports = (app) => {
  const { controller } = app
  router.get('/user/register', controller.userController.register)
  router.get('/user/login', controller.userController.login)
  router.get('/user/query', controller.userController.query)

  app
    .use(router.routes())
    .use(router.allowedMethods())
}
