const BlogListItem = ({ blog, handleVote }) => 
  <li className="blog">
    <div className="vote">
      <button onClick={handleVote} title="vote">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
          {/* <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}
          <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/>
        </svg>
      </button>
      {blog.likes}
    </div>
    <a href={blog.url} target="_blank" rel="noreferrer" className="info">
      <small>{blog.user ? blog.user.name : 'unknown'}</small><br/>
      <b>{blog.title}</b><br/>
      {blog.author}
    </a>
  </li>

export default BlogListItem