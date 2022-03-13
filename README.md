# tiny-http-router

A super tiny router for node http server.

## Install

```
npm install --save tiny-http-router
```

## Use

```js
import http from 'http'
import { router } from 'tiny-http-router'

const yolo = async (req, res, { send, id }) => {
  send(200, id || 'yolo')
}

const server = http.createServer(router({
  // Routes
  '/yolo' : yolo,
  '/yolo/:id' : yolo
}, (req, res, { send }) => {
  // Default (if not route hits)
  send(200, 'default')
})).listen(8080)
```

enjoy.
