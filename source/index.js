import {
  Readable,
  Transform
} from 'stream'
import util from 'util'
import request from 'request'
import querystring from 'querystring'
import async from 'async'

/**
 * Get All Subscribed Pulses from OTX
 * @param  {object} params Object that contains: apikey, [modified_since]
 * @return {stream} rs     Readable stream that returns an array of objects
 */
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


/**
 * Extract IOC from getAll stream
 * @param  {array}  ...type  Array that defines the IOC types
 * @return {stream} tr       Transform stream that returns an array of objects 
 */
var getIOC = (...type) => {

  var tr = new Transform({
    objectMode: true
  })

  tr._transform = function(chunk, encoding, done) {
    chunk.forEach((elem) => {
      elem.indicators.filter((elem) => type.indexOf(elem.type) !== -1).forEach(
        (elem) => tr.push(elem)
      )
    })
    done()
  }

  return tr;
}

module.exports = {
  getAll,
  getIOC
}
