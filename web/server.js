require('dotenv').config()
const express = require('express')
const next = require('next')
const responseTime = require('response-time')

/**
 * 
 */
const NODE_ENV = process.env.NODE_ENV
const WEB_PORT = process.env.WEB_PORT

/**
 * 
 */
async function start () {
  const nextApp = next({ dev: NODE_ENV !== 'production' })
  const requestHandler = nextApp.getRequestHandler()
  await nextApp.prepare()
  const app = express()
  app.use(responseTime())
  app.get('*', (req, res) => {
    return requestHandler(req, res)
  })
  app.listen(WEB_PORT, err => {
    if (err) {
      throw err
    }
    console.log(`> Ready on http://localhost:${WEB_PORT}`)
  })
}

if (require.main === module) {
  start()
}
