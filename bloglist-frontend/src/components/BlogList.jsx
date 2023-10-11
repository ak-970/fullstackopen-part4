import Blog from './Blog'

const BlogList = ({ blogs, handleVote, deleteBlog, user }) =>
  <ul className="blog-list">
    {blogs.map(blog =>
      <Blog
        key={blog.id}
        blog={blog}
        handleVote={() => handleVote(blog.id)}
        deleteBlog={deleteBlog}
        user={user}
      />
    )}
  </ul>


export default BlogList