import Route from 'route-parser'
import url from 'url'

export function router(routes, defaultHandler) {
  const _routes = Object.keys(routes).map(r => { 
    return {route: new Route(r), handler: routes[r] }
  })
  return async function(req, res) {
    const fn = _routes.reduce((def,r) => {
      let params = r.route.match(req.url)
      if (params) {
        params.query = url.parse(req.url, true).query
        return r.handler.bind(params)
      }
      return def
    }, defaultHandler)
    fn(req, res)
  }
}
