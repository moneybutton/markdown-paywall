require('dotenv').config()
const buildApp = require('./app')
const Database = require('./database')

/**
 * 
 */
const API_PORT = process.env.API_PORT

/**
 * 
 */
function start () {
  const db = new Database()
  const app = buildApp(db)
  app.listen(API_PORT, err => {
    if (err) {
      throw err
    }
    console.log(`> Ready on http://localhost:${API_PORT}`)
  })
}

if (require.main === module) {
  start()
}
