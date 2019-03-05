import { getUser } from '../util/api'
import { MoneyButtonClient } from '@moneybutton/api-client'
import ErrorDisplay from '../components/ErrorDisplay'
import InfoDisplay from '../components/InfoDisplay'
import Layout from '../components/Layout'
import Loading from '../components/Loading'
import React from 'react'

/**
 *
 */
const OAUTH_IDENTIFIER = process.env.OAUTH_IDENTIFIER
const OAUTH_REDIRECT_URI = process.env.OAUTH_REDIRECT_URI

/**
 *
 */
export default class PageAccount extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      error: null,
      info: null,
      user: null,
      moneyButtonClient: null
    }
  }

  async componentDidMount () {
    this.setState({
      loading: true,
      error: null,
      info: null
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

  linkWithMoneyButton = async () => {
    try {
      await this.ensureMoneyButtonClientIsLoaded()
      const { moneyButtonClient } = this.state
      moneyButtonClient.requestAuthorization(
        'auth.user_identity:read',
        OAUTH_REDIRECT_URI
      )
    } catch (err) {
      console.error(err)
    }
  }

  async ensureMoneyButtonClientIsLoaded () {
    let { moneyButtonClient } = this.state
    if (moneyButtonClient === null) {
      moneyButtonClient = new MoneyButtonClient(
        OAUTH_IDENTIFIER
      )
      await this.forceStateUpdate({ moneyButtonClient })
    }
  }

  async forceStateUpdate (state) {
    await new Promise(resolve => this.setState(state, resolve))
  }

  render () {
    const {
      loading,
      error,
      info,
      user
    } = this.state
    return (
      <Layout>
        <h1>Account Settings</h1>
        {
          user !== null ? (
            <div>
              <div>
                <span><strong>User Id:</strong> </span>
                <span>{user.id}</span>
              </div><br />
              {
                user.moneyButtonId === undefined ? (
                  <div>
                    <button onClick={this.linkWithMoneyButton}>
                      Link with Money Button
                    </button>
                  </div>
                ) : (
                  <div>
                    <p>✔ Linked with Money Button.</p>
                  </div>
                )
              }
              
            </div>
          ) : null
        }
        <Loading loading={loading} />
        <InfoDisplay info={info} />
        <ErrorDisplay error={error} />
      </Layout>
    )
  }
}
