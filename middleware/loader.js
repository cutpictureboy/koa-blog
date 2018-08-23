const fs = require('fs')
/**
 * 自动装载path路径下的模块，以文件名+LoaderName的形式装载
 * @param {String} path
 * @param {String} loaderName
 */
function autoLoader (path, loaderName) {
  const list = {}
  const localPath = `${process.rootDir}/${path}`
  const fileNames = fs.readdirSync(localPath)
  const fileNameList = fileNames.map(fileName => {
    return fileName.replace('.js', '')
  })

  fileNameList.map(fileName => {
    const name = `${fileName}${loaderName}`
    list[name] = require(`${localPath}/${fileName}`)
  })
  return list
}

const controller = autoLoader('controller', 'Controller')
const service = autoLoader('service', 'Service')

/**
 * 挂载Controller和Service
 * @param {Koa.Context} ctx
 */
module.exports = {
  async addService (ctx, next) {
    ctx.service = service
    await next()
  },

  async addController (app) {
    app.controller = controller
  }
}
