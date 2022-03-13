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

async function yolo(req, res) {
  const id = this.id || 'yolo'
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end(id)
}

const server = http.createServer(router({
  // Routes
  '/yolo' : yolo,
  '/yolo/:id' : yolo
}, (req, res) => {
  // Default (if not route hits)
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('default')
})).listen(8080)
```

enjoy.
