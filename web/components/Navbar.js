import React from 'react'

/**
 * 
 */
export default class Navbar extends React.Component {
  render () {
    return (
      <nav>
        <a href='/'>Home</a>
        <a href='/create'>Create</a>
        <a href='/account'>Account</a>
        <style jsx>{`
          nav {
            padding: 20px;
          }
          nav a {
            margin-right: 10px;
            text-decoration: none;
          }
        `}</style>
      </nav>
    )
  }
}
