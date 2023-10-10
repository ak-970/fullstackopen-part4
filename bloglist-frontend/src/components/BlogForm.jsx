const BlogForm = ({
  handleSubmit,
  newTitle, handleTitleChange,
  newAuthor, handleAuthorChange,
  newUrl, handleUrlChange
}) =>
  <form onSubmit={handleSubmit}>
    <div>
      <label htmlFor='title'>Title: </label>
      <input id='title' type='text' value={newTitle} onChange={handleTitleChange}/>
    </div>
    <div>
      <label htmlFor='author'>Author: </label>
      <input id='author' type='text' value={newAuthor} onChange={handleAuthorChange}/>
    </div>
    <div>
      <label htmlFor='url'>URL: </label>
      <input id='url' type='url' value={newUrl} onChange={handleUrlChange}/>
    </div>
    <input type='submit' value='add blog'/>
  </form>

export default BlogForm