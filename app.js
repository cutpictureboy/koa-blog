const Koa = require('koa')
const session = require('koa-session')
const loader = require('./middleware/loader')
const formate = require('./middleware/formate')
const utils = require('./middleware/utils')
const validate = require('./middleware/validate')
const redis = require('./middleware/redis')
const auth = require('./middleware/auth')
const router = require('./router')
const keyConfig = require('./config/key.config')
const sessionConfig = require('./config/session.config')

const app = new Koa()
app.keys = [keyConfig.cookie]
app.use(session(sessionConfig, app))
app.use(loader.addService)
app.use(formate)
app.use(utils)
app.use(validate)
app.use(redis)
app.use(auth)
loader.addController(app)
router(app)

app.listen(4396)
console.log('Application listen http://localhost:4396')
