import http from 'http'
import { router, method, methods } from './index.js'

const yolo = async (req, res, { send, id }) => {
  send(200, id || 'yolo')
}

async function query(req, res, { send, query }) {
  send(200, query?.eple || 'query')
}

async function json(req, res, { send }) {
  send(200, { eple: 'kake' })
}

async function jsonPost(req, res, { send, json }) {
  if (req.method !== 'POST')
    return send(400, 'Wrong method')
  const _json = await json()
  send(200, _json)
}

async function textPost(req, res, { send, text }) {
  const _text = await text()
  send(200, _text)
}

const server = http.createServer(router({
  // Routes
  '/yolo'      : yolo,
  '/yolo/:id'  : yolo,
  '/query'     : query,
  '/json'      : json,
  '/json/post' : jsonPost,
  '/text/post' : textPost,
  '/get'       : method('GET', yolo),
  '/methods'   : methods({
    GET: yolo,
    POST: yolo
  }) 
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
  const r6 = await fetch('http://localhost:8080/json/post')
  assert(r6.status === 400)
  const r7 = await fetch('http://localhost:8080/json/post', {
    method: 'POST',
    body: JSON.stringify({
      yolo: 'bolo'
    }),
    headers: {
      'content-type': 'application/json'
    }
  }).then(res => res.json())
  assert(r7?.yolo === 'bolo')
  const r8 = await fetch('http://localhost:8080/text/post', {
    method: 'POST',
    body: 'eplekakefis'
  }).then(res => res.text())
  assert(r8 === 'eplekakefis')

  const r9 = await fetch('http://localhost:8080/get', { method: 'DELETE' })
  assert(r9.status === 400)
  const r10 = await fetch('http://localhost:8080/get', { method: 'GET' })
  assert(r10.status === 200)

  const r11 = await fetch('http://localhost:8080/methods', { method: 'GET' })
  assert(r11.status === 200)

  const r12 = await fetch('http://localhost:8080/methods', { method: 'POST' })
  assert(r12.status === 200)

  const r13 = await fetch('http://localhost:8080/methods', { method: 'PATCH' })
  assert(r13.status === 400)
  const r13_text = await r13.text()
  assert(r13_text === 'Unsupported http method')

  console.log('All good dog')
  server.close() 
})()
