const nodeMailer = require('nodemailer')
const config = require('../config/mail.config')

const postMail = async function (options) {
  const transporter = await nodeMailer.createTransport(config)
  await transporter.sendMail(options)
}

module.exports = {
  postMail
}
