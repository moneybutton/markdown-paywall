import React from 'react'
import '../styles/markdown.css'
import { MarkdownPreview } from 'react-marked-markdown'

class PostContent extends React.Component {
  buildPreview = () => {
    const { title, free, paid } = this.props
    return [
      title.length > 0 ? `# ${title}` : '' ,
      free,
      '',
      paid
    ].join("\n")
  }

  render () {
    return (
      <div className='markdown-body'>
        <MarkdownPreview gfm value={this.buildPreview()} />
      </div>
    )
  }
}

export { PostContent }
