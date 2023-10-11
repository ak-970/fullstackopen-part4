import { useState } from 'react'

const Blog = ({ blog, handleVote, deleteBlog, user }) => {

  const [visible, setVisible] = useState(0)
  const states = ['hide', 'show']
  const toggleVisibility = (event) => {
    event.preventDefault()
    setVisible((visible + 1) % 2)
  }
  const removeBlog = (event) => {
    event.preventDefault()
    deleteBlog(blog.id)
    // console.log('remove')
  }

  return (
    <li className="blog">

      <div className={`likes vote ${states[visible]}`}>
        <button className='vote-blog' onClick={handleVote} title="vote">
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
            {/* <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}
            <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/>
          </svg>
        </button>
        {blog.likes}
      </div>

      <a href={blog.url} target="_blank" rel="noreferrer" className="info">
        <span className={`user ${states[visible]}`}><small>{blog.user ? blog.user.name : 'unknown'}</small></span>
        <span className='title'><b>{blog.title}</b></span>
        <span className='author'>{blog.author}</span>
        <span className={`url ${states[visible]}`}>{blog.url}</span>

        {user && user.username === blog.user.username && <button className={`remove-blog ${states[visible]}`} onClick={removeBlog}>remove this blog</button>}

        <button className='toggle-visibility' onClick={toggleVisibility}>{states[(visible + 1) % 2]}</button>
      </a>

    </li>
  )
}

export default Blog