import { getUser, getPost } from '../util/api'
import { withRouter } from 'next/router'
import ErrorDisplay from '../components/ErrorDisplay'
import Layout from '../components/Layout'
import Loading from '../components/Loading'
import Post from '../components/Post'
import React from 'react'

/**
 * 
 */
class PagePost extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      error: null,
      user: null,
      post: null,
      author: null
    }
  }

  async componentDidMount () {
    const { query } = this.props.router
    const { postId } = query
    if (postId === undefined) {
      this.props.router.push('/')
      return
    }
    try {
      const [
        user,
        { post, author }
      ] = await Promise.all([
        getUser(),
        getPost(postId)
      ])
      this.setState({
        loading: false,
        user,
        post,
        author
      })
    } catch (err) {
      this.setState({
        loading: false,
        error: err.message
      })
    }
  }

  onPurchase () {
    window.location.reload()
  }

  render () {
    const {
      loading,
      user,
      post,
      author,
      error
    } = this.state
    return (
      <Layout>
        <Loading loading={loading} />
        <Post user={user} post={post} author={author} onPurchase={this.onPurchase} />
        <ErrorDisplay error={error} />
      </Layout>
    )
  }
}

export default withRouter(PagePost)
