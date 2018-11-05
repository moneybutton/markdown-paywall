import { getUser, createPost } from '../util/api'
import ErrorDisplay from '../components/ErrorDisplay'
import Layout from '../components/Layout'
import Loading from '../components/Loading'
import { PostContent } from '../components/PostContent'
import React from 'react'
import Router from 'next/router'

/**
 *
 */
export default class PageCreate extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      free: '',
      paid: '',
      loading: true,
      error: null,
      user: null,
      post: null
    }
  }

  async componentDidMount () {
    this.setState({
      loading: true,
      error: null
    }, async () => {
      try {
        this.setState({
          loading: false,
          user: await getUser()
        })
      } catch (err) {
        this.setState({
          loading: false,
          error: err.message
        })
      }
    })
  }

  async onSubmit (event) {
    event.preventDefault()
    const {
      title,
      free,
      paid
    } = this.state
    this.setState({
      loading: true,
      error: null
    }, async () => {
      try {
        this.setState({
          loading: false,
          post: await createPost({ title, free, paid })
        }, async () => {
          setTimeout(() => { Router.push('/') }, 3000)
        })
      } catch (err) {
        this.setState({
          loading: false,
          error: err.message
        })
      }
    })
  }

  render () {
    const {
      title,
      free,
      paid,
      loading,
      error,
      user,
      post
    } = this.state
    const needsMoneyButtonId = user !== null && user.moneyButtonId === undefined
    const formIsDisabled = loading || needsMoneyButtonId || post !== null
    return (
      <Layout>
        <h1>Create Post</h1>
        <div className='container'>
          <div className='element'>
            {
              user !== null ? (
                <form onSubmit={this.onSubmit.bind(this)}>
                  <input
                    className='field'
                    type='text'
                    value={title}
                    onChange={event => this.setState({ title: event.target.value })}
                    placeholder='Enter title.'
                    disabled={formIsDisabled}
                  /><br />
                  <textarea
                    className='field'
                    value={free}
                    onChange={event => this.setState({ free: event.target.value })}
                    placeholder='Enter free content.'
                    disabled={formIsDisabled}
                  /><br />
                  <textarea
                    className='field'
                    value={paid}
                    onChange={event => this.setState({ paid: event.target.value })}
                    placeholder='Enter paid content.'
                    disabled={formIsDisabled}
                  /><br />
                  <button type='submit' disabled={formIsDisabled}>
                    {loading ? 'Creating ...' : 'Create'}
                  </button>
                </form>
              ) : null
            }
            {
              needsMoneyButtonId ? (
                <p>Please, set your Money Button Id on your Account page before creating a post.</p>
              ) : null
            }
            {
              post !== null ? (
                <div>
                  <p>Created post successfully.</p>
                  <p>Redirecting back to homepage ...</p>
                </div>
              ) : null
            }
          </div>
          <div className='element'>
            <PostContent title={title} free={free} paid={paid} />
          </div>
        </div>

        <Loading loading={loading} />
        <ErrorDisplay error={error} />
        <style jsx>{`
          .field {
            margin-bottom: 5px;
          }
          .field:last-of-type {
            margin-bottom: 10px;
          }
          textarea {
            width: 90%;
            height: 100px;
          }

          .container {
            display: flex;
            flex-direction: row;
          }

          .element {
            width: 50%;
          }
        `}</style>
      </Layout>
    )
  }
}
