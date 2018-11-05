import Link from 'next/link'
import moment from 'moment'
import MoneyButton from '@moneybutton/react-money-button'
import { PostContent } from '../components/PostContent'
import React from 'react'

/**
 *
 */
const CLIENT_IDENTIFIER = process.env.CLIENT_IDENTIFIER

/**
 *
 */
export default class Post extends React.Component {
  render () {
    let {
      user,
      post,
      author,
      onPurchase
    } = this.props
    if (user === null || post === null || author === null) {
      return null
    }
    return (
      <div className='post'>
        <Link href={{ pathname: '/post', query: { postId: post.id } }}>
          <p className='date'>{moment(post.createdAt).format('LLLL')}</p>
        </Link>
        <PostContent free={post.free} paid={post.paid} title={post.title} />
        {
          post.paid === null ? (
            <div>
              <p>To continue reading, please buy this post with Money Button.</p>
              <MoneyButton
                to={author.moneyButtonId}
                amount={post.price}
                currency={'USD'}
                label={'Buy'}
                type={'buy'}
                clientIdentifier={CLIENT_IDENTIFIER}
                buttonData={JSON.stringify({
                  userId: user.id,
                  postId: post.id
                })}
                onPayment={onPurchase}
              />
            </div>
          ) : null
        }
        {
          post.paid !== null ? (
            <div>
              <p>Tip the author with Money Button.</p>
              <MoneyButton
                to={author.moneyButtonId}
                amount={post.price}
                currency={'USD'}
                label={'Tip'}
                type={'tip'}
                clientIdentifier={CLIENT_IDENTIFIER}
              />
            </div>
          ) : null
        }
        <style jsx>{`
          .post {
            margin: 0 0 30px 0;
          }
          .post div:last-of-type {
            padding-bottom: 20px;
            border-bottom: 1px solid lightgray;
          }
          .post:last-of-type div:last-of-type {
            border-bottom: none;
          }
          .post .date {
            padding: 0;
            color: blue;
            cursor: pointer;
            text-decoration: underline;
          }
          .post .title {
            margin-top: 5px;
          }
        `}</style>
      </div>
    )
  }
}
