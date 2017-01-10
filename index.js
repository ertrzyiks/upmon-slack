var xtend = require('xtend')
var config = require('rc')('upmon')
var ndjson = require('ndjson')
var combine = require('stream-combiner2')
var notify = require('./notify')

config.slack = config.slack || {}

module.exports = function (opts) {
  opts = opts || {}
  return combine(
    ndjson.parse(),
    notify(xtend(config.slack, opts)),
    ndjson.stringify()
  )
}
