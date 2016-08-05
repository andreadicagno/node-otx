import {
  Readable,
  Transform
} from 'stream'
import util from 'util'
import request from 'request'
import querystring from 'querystring'

/**
 * Get All Subscribed Pulses from OTX
 * @param  {object} params Object that contains: apikey, [modified_since], [limit]
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
    subscribed: '/v1/pulses/subscribed'
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
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        let info = JSON.parse(body)
        options.url = info.next
        rs.push(info.results)
        if (!options.url) {
          rs.push(null)
        }
      } else {
        if (error) {
          return rs.emit('error', error)
        } else {
          return rs.emit('error', new Error(`Connection Error (${response.statusCode}), check the API KEY`))
        }
      }
    })
  }
  return rs
}


/**
 * Extract IOC from getAll stream
 * @param  {array}    types   Array that defines the IOC types
 * @param  {boolean}  iocOnly Defines if it returns only the IOC indicators
 * @return {stream}   tr      Transform stream that returns an array of objects
 */
var getIOC = (types = ['IPv4', 'domain'], iocOnly = false) => {

  var tr = new Transform({
    objectMode: true
  })

  tr._transform = function(chunk, encoding, done) {
    chunk.forEach((elem) => {
      elem.indicators.filter((elem) => types.indexOf(elem.type) !== -1).forEach(
        (elem) => {
          if (iocOnly) {
            tr.push(elem.indicator)
          } else {
            tr.push(elem)
          }
        }
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
