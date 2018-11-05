const moment = require('moment')
const RestError = require('./rest-error')
const uuid = require('uuid')

/**
 * 
 */
const DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'

/**
 * 
 */
class Database {
  constructor () {
    this.users = []
    this.posts = []
    this.purchases = []
    this.addMockData()
  }

  getUser (userId) {
    return this.users.find(({ id }) => userId === id) || null
  }

  createUser (attributes = {}) {
    this.validateUserAttributes(attributes)
    const user = {
      id: uuid.v4(),
      createdAt: moment().format(DATE_FORMAT),
      ...attributes
    }
    this.users.push(user)
    return user
  }

  updateUser (userId, attributes = {}) {
    this.validateUserAttributes(attributes)
    const index = this.users.findIndex(({ id }) => userId === id)
    this.users[index] = {
      ...this.users[index],
      ...attributes
    }
  }

  validateUserAttributes (attributes = {}) {
    const { moneyButtonId } = attributes
    if (
      moneyButtonId !== undefined &&
      !(
        typeof moneyButtonId === 'string' &&
        /^[0-9]+$/.test(moneyButtonId)
      )
    ) {
      throw new RestError(400, 'Invalid user attributes.')
    }
  }

  getPosts (user) {
    return this.posts
      .slice(0)
      .sort((a, b) => {
        const dateA = moment(a.createdAt, DATE_FORMAT)
        const dateB = moment(b.createdAt, DATE_FORMAT)
        const diff = dateB - dateA
        return diff !== 0
          ? diff
          : b.id.localeCompare(a.id)
      })
      .map(this.restrictUserAccess(user))
  }

  getPost (postId, user) {
    const post = this.posts.find(({ id }) => postId === id)
    if (post === undefined) {
      return null
    }
    return this.restrictUserAccess(user)(post)
  }

  createPost (user, attributes = {}) {
    const {
      id: authorId,
      moneyButtonId: authorMoneyButtonId
    } = user
    if (authorMoneyButtonId === undefined) {
      throw new RestError(400, 'Author has no Money Button id.')
    }
    this.validatePostAttributes(attributes)
    const post = {
      ...attributes,
      id: uuid.v4(),
      createdAt: moment().format(DATE_FORMAT),
      authorId,
      price: '0.01'
    }
    this.posts.push(post)
    return post
  }

  validatePostAttributes (attributes = {}) {
    const { title, free, paid } = attributes
    if (
      !(typeof title === 'string' && title.length > 0) ||
      !(typeof free === 'string' && free.length > 0) ||
      !(typeof paid === 'string' && paid.length > 0)
    ) {
      throw new RestError(400, 'Invalid post attributes.')
    }
  }

  restrictUserAccess (user) {
    return post => {
      if (
        this.isAuthor(user, post) ||
        this.hasPurchased(user, post)
      ) {
        return post
      }
      return { ...post, paid: null }
    }
  }

  getPurchase (userId, postId) {
    return this.purchases.find(
      purchase => (
        purchase.userId === userId &&
        purchase.postId === postId
      )
    ) || null
  }

  createPurchase (userId, postId, attributes = {}) {
    const purchase = {
      id: uuid.v4(),
      createdAt: moment().format(DATE_FORMAT),
      userId,
      postId,
      ...attributes
    }
    this.purchases.push(purchase)
    return purchase
  }

  getAuthors (posts) {
    const authors = []
    for (const post of posts) {
      const author = authors.find(({ id }) => id === post.authorId)
      if (author === undefined) {
        authors.push(this.getUser(post.authorId))
      }
    }
    return authors
  }

  isAuthor (user, post) {
    return user.id === post.authorId
  }

  hasPurchased (user, post) {
    return this.getPurchase(user.id, post.id) !== null
  }

  addMockData () {
    const user = this.createUser({
      moneyButtonId: '5'
    })
    this.createPost(
      user,
      {
        title: 'Curabitur urna est, maximus ultricies libero et, venenatis imperdiet quam.',
        free: 'Nam condimentum enim id massa gravida auctor. Donec egestas varius velit quis volutpat. Donec vel ultrices eros. Fusce quis quam eget sem lobortis porta vitae non odio. Nunc vulputate sit amet massa in porttitor. Pellentesque lectus arcu, tempor eget commodo eget, commodo sed lacus. Vivamus eleifend ex in velit molestie ullamcorper. Fusce nec congue velit, non bibendum diam. Morbi lorem mi, vestibulum sit amet gravida eget, elementum id lacus. Mauris mollis non felis nec malesuada. Nam sollicitudin quam massa, sit amet efficitur magna laoreet et. Vivamus nec lectus aliquam, maximus libero a, congue erat.',
        paid: 'Etiam id ante vitae nibh posuere hendrerit. Quisque magna elit, sagittis quis nulla at, viverra faucibus sapien. Ut consequat ligula et justo dapibus, sed accumsan est commodo. Duis ex sapien, pulvinar sagittis tincidunt quis, mollis sed ligula. Pellentesque malesuada et tellus ac auctor. In eu tellus turpis. Sed lobortis ex vitae ipsum cursus condimentum.'
      }
    )
  }
}

module.exports = Database
