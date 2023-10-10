import BlogListItem from "./BlogListItem"

const BlogList = ({ blogs, handleVote }) =>
  <ul className="blog-list">
    {blogs.map(blog =>
      <BlogListItem
        key={blog.id}
        blog={blog}
        handleVote={() => handleVote(blog.id)}
      />
    )}
  </ul>


export default BlogList