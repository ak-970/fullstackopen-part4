import BlogListItem from './BlogListItem'

const BlogList = ({ blogs, handleVote, deleteBlog, user }) =>
  <ul className="blog-list">
    {blogs.map(blog =>
      <BlogListItem
        key={blog.id}
        blog={blog}
        handleVote={() => handleVote(blog.id)}
        deleteBlog={deleteBlog}
        user={user}
      />
    )}
  </ul>


export default BlogList