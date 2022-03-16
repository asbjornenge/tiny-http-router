import Route from 'route-parser'
import url from 'url'
import bodyParser from 'body-parser'

const jsonParser = bodyParser.json()
const jsonParserAsync = (req, res) => {
  return new Promise((resolve, reject) => {
    jsonParser(req, res, (err) => {
      if (err) return reject(err)
      resolve(req.body)
    })
  })
}

const textParser = bodyParser.text()
const textParserAsync = (req, res) => {
  return new Promise((resolve, reject) => {
    textParser(req, res, (err) => {
      if (err) return reject(err)
      resolve(req.body)
    })
  })
}

const wrap = (fn, params={}) => {
  return async function(req, res) {
    params.query = url.parse(req.url, true).query
    params.send = (status, payload, content_type='text/plain', headers={}) => {
      if (typeof payload === 'object') {
        payload = JSON.stringify(payload)
        content_type = 'application/json'
      }
      res.writeHead(status, Object.assign({ 'Content-Type': content_type }, headers))
      res.end(payload)
    }
    params.json = async () => { return await jsonParserAsync(req, res) } 
    params.text = async () => { return await textParserAsync(req, res) }
    await fn(req, res, params)
  }
}

export function router(routes, defaultHandler) {
  const _routes = Object.keys(routes).map(r => {
    return {route: new Route(r), handler: routes[r] }
  })
  return async function(req, res) {
    const fn = _routes.reduce((def,r) => {
      let params = r.route.match(req.url)
      if (params) return wrap(r.handler, params)
      return def
    }, wrap(defaultHandler))
    fn(req, res)
  }
}

export function method(method, fn) {
  return async function(req, res, params) {
    if (req.method !== method) {
      res.writeHead(400, { 'Content-Type': 'text/plan' })
      return res.end(`Unsupported http method ${req.method}`)
    }
    return await fn(req, res, params)
  }
}
