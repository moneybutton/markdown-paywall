import { getUser, getPosts } from '../util/api'
import ErrorDisplay from '../components/ErrorDisplay'
import Layout from '../components/Layout'
import Loading from '../components/Loading'
import Post from '../components/Post'
import React from 'react'
import Router from 'next/router'

/**
 * 
 */
export default class PageIndex extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      error: null,
      user: null,
      posts: null,
      authors: null
    }
  }

  async componentDidMount () {
    try {
      const [
        user,
        { posts, authors }
      ] = await Promise.all([
        getUser(),
        getPosts()
      ])
      this.setState({
        loading: false,
        user,
        posts,
        authors
      })
    } catch (err) {
      this.setState({
        loading: false,
        error: err.message
      })
    }
  }

  onPurchase (post) {
    return () => {
      setTimeout(() => {
        Router.push({
          pathname: '/post',
          query: { postId: post.id }
        })
      }, 3000)
    }
  }

  render () {
    const {
      loading,
      user,
      posts,
      authors,
      error
    } = this.state
    return (
      <Layout>
        {
          user !== null && posts !== null && authors !== null ? (
            <ul>
              {
                posts.map(post => (
                  <Post
                    key={post.id}
                    user={user}
                    post={post}
                    author={authors.find(({ id }) => id === post.authorId)}
                    onPurchase={this.onPurchase(post)}
                  />
                ))
              }
            </ul>
          ) : null
        }
        <Loading loading={loading} />
        <ErrorDisplay error={error} />
        <style jsx>{`
          ul {
            list-style: none;
            margin: 0;
            padding: 0;
          }
        `}</style>
      </Layout>
    )
  }
}
