import { useState } from 'react'

const BlogForm = ({ createBlog }) => {

  // use states
  const [newTitle, setNewTitle] = useState([])
  const [newAuthor, setNewAuthor] = useState([])
  const [newUrl, setNewUrl] = useState([])

  // event handlers
  const handleTitleChange = (event) => setNewTitle(event.target.value)
  const handleAuthorChange = (event) => setNewAuthor(event.target.value)
  const handleUrlChange = (event) => setNewUrl(event.target.value)

  // method functions
  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title : newTitle,
      author : newAuthor,
      url : newUrl,
      likes : 0
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }


  return (
    <form onSubmit={addBlog}>
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
      <div className='button-wrap'><input type='submit' value='add blog'/></div>
    </form>
  )

}

export default BlogForm