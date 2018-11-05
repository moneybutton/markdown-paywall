const cors = require('cors')
const express = require('express')
const responseTime = require('response-time')
const RestError = require('./rest-error')
const session = require('express-session')

/**
 * 
 */
const SESSION_KEY = process.env.SESSION_KEY
const SESSION_SECRET = process.env.SESSION_SECRET
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

/**
 * 
 */
function buildApp (db) {
  const app = express()

  app.use(responseTime())

  app.use(express.json())

  app.use(cors({
    origin: true,
    credentials: true
  }))

  app.use(session({
    key: SESSION_KEY,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }))

  app.use((req, res, next) => {
    let { loggedIn } = getAuthData(req.session)
    if (!loggedIn) {
      const user = db.createUser()
      setAuthData(user, req.session)
    }
    next()
  })

  app.get('/whoami', function (req, res) {
    const { user } = getAuthData(req.session)
    res.json({ data: user })
  })

  app.patch('/users/:userId', (req, res) => {
    const { userId } = req.params
    const attributes = req.body
    const { user } = getAuthData(req.session)
    if (userId !== user.id) {
      throw new RestError(401, 'Unauthorized.')
    }
    db.updateUser(user.id, attributes)
    res.json({ data: db.getUser(user.id) })
  })

  app.get('/posts', (req, res) => {
    const { user } = getAuthData(req.session)
    const posts = db.getPosts(user)
    const authors = db.getAuthors(posts)
    res.json({ data: posts, included: authors })
  })

  app.get('/posts/:postId', (req, res) => {
    const { postId } = req.params
    const { user } = getAuthData(req.session)
    const post = db.getPost(postId, user)
    if (post === null) {
      throw new RestError(404, 'Post not found.')
    }
    const author = db.getUser(post.authorId)
    res.json({ data: post, included: author })
  })

  app.post('/posts', (req, res) => {
    const attributes = req.body
    const { user } = getAuthData(req.session)
    const post = db.createPost(user, attributes)
    res.json({ data: post })
  })

  app.post('/webhook', function (req, res) {
    const { secret, payment } = req.body
    if (secret !== WEBHOOK_SECRET) {
      throw new RestError(400, 'Wrong webhook secret.')
    }
    const { buttonData, paymentOutputs } = payment
    let userId, postId
    try {
      ;({ userId, postId } = JSON.parse(buttonData));
    } catch (err) {
    }
    const user = db.getUser(userId)
    if (user === null) {
      throw new RestError(404, 'User not found.')
    }
    const post = db.getPost(postId, userId)
    if (post === null) {
      throw new RestError(404, 'Post not found.')
    }
    const author = db.getUser(post.authorId)
    const paymentOutput = paymentOutputs.find(somePaymentOutput => {
      return (
        somePaymentOutput.userId === author.moneyButtonId &&
        somePaymentOutput.amount === post.price &&
        somePaymentOutput.currency === 'USD'
      )
    })
    if (paymentOutput === undefined) {
      throw new RestError(400, 'Invalid payment.')
    }
    if (!db.hasPurchased(user, post)) {
      db.createPurchase(user.id, post.id)  
    }
    res.sendStatus(200)
  })

  app.use((err, req, res, next) => {
    if (err instanceof RestError) {
      res.status(err.status)
      res.json({ error: err.message })
    } else {
      res.status(500)
      res.json({ error: 'Unexpected error.' })
      console.error(err)
    }
  })

  return app

  function getAuthData (session) {
    if (session.auth !== undefined) {
      const { userId } = session.auth
      if (userId !== undefined) {
        return {
          loggedIn: true,
          user: db.getUser(userId)
        }
      }
    }
    return { loggedIn: false }
  }
  
  function setAuthData (user, session) {
    session.auth = { userId: user.id }
  }
}

module.exports = buildApp
