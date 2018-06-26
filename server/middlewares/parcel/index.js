const env = process.env.NODE_ENV ==='production' ? 'pro' : 'dev'

module.exports = require(`./${env}.js`)
