import http from 'http'
import { router } from './index.js'

const yolo = async (req, res, { send, id }) => {
  send(200, id || 'yolo')
}

async function query(req, res, { send, query }) {
  send(200, query?.eple || 'query')
}

async function json(req, res, { send }) {
  send(200, { eple: 'kake' })
}

const server = http.createServer(router({
  // Routes
  '/yolo'     : yolo,
  '/yolo/:id' : yolo,
  '/query'    : query,
  '/json'     : json 
}, (req, res, { send }) => {
  // Default (if not route hits)
  send(200, 'default')
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
  const r4 = await fetch('http://localhost:8080/query?eple=kake').then(res => res.text())
  assert(r4 === 'kake')
  const r5 = await fetch('http://localhost:8080/json')
  assert(r5.headers.get('content-type') === 'application/json')
  const r5j = await r5.json()
  assert(r5j?.eple === 'kake')
  console.log('All good dog')
  server.close() 
})()
