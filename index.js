import Route from 'route-parser'
import url from 'url'

const wrap = (fn, params={}) => {
  return async function(req, res) {
    params.query = url.parse(req.url, true).query
    params.send = (status, payload, content_type='text/plain', headers={}) => {
      res.writeHead(status, Object.assign({ 'Content-Type': content_type }, headers))
      res.end(payload)
    }
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
