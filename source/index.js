import {
  Readable,
  Transform
} from 'stream'
import util from 'util'
import request from 'request'
import querystring from 'querystring'
import async from 'async'


let getAll = (params) => {

  if (!params || !params.apikey) {
    throw new Error('No apikey has been passed.')
  }

  let rs = Readable({
    objectMode: true
  })

  let path = {
    url: 'https://otx.alienvault.com/api',
    subscribed: '/v1/pulses/subscribed/'
  }

  let apikey = params.apikey
  delete params.apikey
  let options = {
    url: path.url + path.subscribed + '?' + querystring.stringify(params),
    headers: {
      'X-OTX-API-KEY': apikey
    }
  }

  rs._read = () => {
    async.whilst(
      () => {
        return options.url
      },
      (callback) => {
        request(options, (error, response, body) => {
          if (!error && response.statusCode === 200) {
            let info = JSON.parse(body)
            rs.count = info.count
            options.url = info.next
            rs.push(info.results)
            callback()
          } else {
            return rs.emit('error', new Error(`Connection Error (${response.statusCode}), check the API KEY`))
          }
        })
      },
      (err) => {
        if (err) {
          return rs.emit('error', err)
        }
        rs.push(null)
      }
    )
  }

  return rs
}

var getIOC = (type) => {

  var liner = new stream.Transform({
    objectMode: true
  })

  liner._transform = function(chunk, encoding, done) {
    var data = chunk.toString()
    if (this._lastLineData) data = this._lastLineData + data

    var lines = data.split('\n')
    this._lastLineData = lines.splice(lines.length - 1, 1)[0]

    lines.forEach(this.push.bind(this))
    done()
  }

  liner._flush = function(done) {
    if (this._lastLineData) this.push(this._lastLineData)
    this._lastLineData = null
    done()
  }

}

module.exports = {
  getAll,
  getIOC
}
