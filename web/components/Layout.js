import 'react'

/**
 * 
 */
export default function Layout ({ children }) {
  return (
    <div>
      <header>
        <nav>
          <a href='/'>Home</a>
          <a href='/create'>Create</a>
          <a href='/account'>Account</a>
        </nav>
      </header>
      <section>
        {children}
      </section>
      <style jsx global>{`
        input[type=text] {
          padding: 10px;
          font-size: 14px;
        }
        textarea {
          padding: 10px;
          font-size: 13px;
          resize: none;
        }
        textarea,
        input[type=text] {
          font-family: Arial;
          border: 1px solid #ccc;
          border-radius: 3px;
        }
      `}</style>
      <style jsx>{`
        header {
          margin-bottom: 20px;
        }
        header nav {
          padding: 20px;
        }
        header nav a {
          padding: 0 10px;
          text-decoration: none;
          border-right: 1px solid lightgray;
        }
        header nav a:last-of-type {
          border-right: 0;
        }
        section {
          max-width: 600px;
          padding: 0 20px;
        }
      `}</style>
    </div>
  )
}
