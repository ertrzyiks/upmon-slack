var IncomingWebhook = require('@slack/client').IncomingWebhook;

var url = process.env.SLACK_WEBHOOK_URL || ''
var webhook = new IncomingWebhook(url)
var through = require('through2')

var COLORS = {
  'FAIL': '#f60000',
  'RECOVER': '#36a64f'
}

function sendMail (type, lastPing, ping) {
  var text = type + ' ' + ping.url + ' (HTTP ' + ping.status + ')'
  var attachments = [
    {color: COLORS[type], text: text}
  ]

  if (lastPing) {
    attachments.push({color: COLORS[type], text: 'Last success at: ' + new Date(lastPing.timestamp)})
  }

  var params = {
    username: 'upmon-bot',
    attachments: attachments
  }

  webhook.send(params, function(err, res) {
    if (err) {
      console.err('Error:', err);
    }
  });
}

var sendFailMail = sendMail.bind(null, 'FAIL')
var sendRecoverMail = sendMail.bind(null, 'RECOVER')

module.exports = function (opts) {
  opts = opts || {}

  var lastPings = {}

  return through.obj(function (ping, enc, cb) {
    var lastPing = lastPings[ping.url]

    if ((!lastPing || lastPing.status == 200) && ping.status != 200) {
      sendFailMail(lastPing, ping)
    } else if (lastPing && lastPing.status != 200 && ping.status == 200) {
      sendRecoverMail(lastPing, ping)
    }

    lastPings[ping.url] = ping

    this.push(ping)
    cb()
  })
}
