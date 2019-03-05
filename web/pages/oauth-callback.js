import { getUser, updateUser } from '../util/api'
import { MoneyButtonClient, AuthError as MoneyButtonAuthError } from '@moneybutton/api-client'
import Layout from '../components/Layout'
import React from 'react'
import Router from 'next/router'

/**
 *
 */
const OAUTH_IDENTIFIER = process.env.OAUTH_IDENTIFIER

/**
 *
 */
export default class PageAccount extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      error: null,
      info: null,
      user: null,
      moneyButtonClient: null
    }
  }

  async componentDidMount () {
    await this.forceStateUpdate({
      loading: true,
      error: null,
      info: null
    })
    await new Promise(async resolve => {
      try {
        this.setState({
          loading: false,
          user: await getUser()
        }, resolve)
      } catch (err) {
        this.setState({
          loading: false,
          error: err.message
        }, resolve)
      }
    })
    try {
      await this.ensureMoneyButtonClientIsLoaded()
      const { user, moneyButtonClient } = this.state
      await moneyButtonClient.handleAuthorizationResponse()
      const { id: moneyButtonId } = await moneyButtonClient.getIdentity()
      await updateUser(user.id, { moneyButtonId })
    } catch (err) {
      if (err instanceof MoneyButtonAuthError) {
        throw new Error(`Authorization grant failed: ${err.message}.`)
      }
      throw err
    } finally {
      setTimeout(
        () => {
          Router.push('/account')
        },
        3000
      )
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
    return (
      <Layout>
        <h4>Redirecting ...</h4>
      </Layout>
    )
  }
}
