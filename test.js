import http from 'http'
import { router } from './index.js'

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

import fetch from 'node-fetch'
import assert from 'assert'

(async () => {
  const r1 = await fetch('http://localhost:8080').then(res => res.text())
  assert(r1 === 'default')
  const r2 = await fetch('http://localhost:8080/yolo').then(res => res.text())
  assert(r2 === 'yolo')
  const r3 = await fetch('http://localhost:8080/yolo/2').then(res => res.text())
  assert(r3 === '2')
  console.log('All good dog')
  server.close() 
})()
