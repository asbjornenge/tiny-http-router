# tiny-http-router

A super tiny router for node http server.

## Install

```
npm install --save tiny-http-router
```

## Use

```js
import http from 'http'
import { router, method, methods } from 'tiny-http-router'

const yolo = async (req, res, { send, id }) => {
  send(200, id || 'yolo')
}

const server = http.createServer(router({
  // Routes
  '/yolo' : yolo,
  '/yolo/:id' : method('GET', yolo),
  '/bolo/:id' : methods({
    GET: yolo,
    POST: yolo
  })
}, (req, res, { send }) => {
  // Default (if not route hits)
  send(200, 'default')
})).listen(8080)
```

## Exports

```
router  - funciton that takes object of routes
method  - function wrapper to enforce http method
methods - function wrapper to enforce http methods
```

## Params

Params is an object passed as the 3rd parameter to any function used as a route.
It has the following properties.

```
send - helper function to easily respond to http request
query - query params
json - async helper function to parse json payload
text - async helper function to parse text payload
```

enjoy.
