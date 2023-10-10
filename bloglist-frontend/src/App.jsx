import { useState, useEffect } from 'react'

// components
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

// services
import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {

  // use states
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [user, setUser] = useState(null)

  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState([])
  const [newAuthor, setNewAuthor] = useState([])
  const [newUrl, setNewUrl] = useState([])

  const [notification, setNotification] = useState({ message : null, type : ''})


  // use effects
  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        setBlogs(initialBlogs)
        // console.log(blogs)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  // // event handlers
  const handleUsernameChange = (event) => setNewUsername(event.target.value)
  const handlePasswordChange = (event) => setNewPassword(event.target.value)
  const handleTitleChange = (event) => setNewTitle(event.target.value)
  const handleAuthorChange = (event) => setNewAuthor(event.target.value)
  const handleUrlChange = (event) => setNewUrl(event.target.value)


  // helper functions
  const notify = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => {
        setNotification({...notification, message : null})
    }, 5000)
  }
  // const nameAlreadyExists = (name) => persons.find(p => name === p.name) !== undefined
  // const filteredPersons = persons.filter(p => p.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) || p.number.includes(filter))


  // method functions
  const handleLogin = async (event) => {
    event.preventDefault()
    // console.log('logging in with', newUsername, newPassword)
    
    try {
      const user = await loginService.login({
        username : newUsername,
        password : newPassword,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      // notify(`Hi ${user.name}!`, 'success')
      setNewUsername('')
      setNewPassword('')
    } catch (exception) {
      notify('Wrong credentials', 'error')
    }
  }
  
  const addBlog = (event) => {
    event.preventDefault()
    
    const blogObject = {
      title : newTitle,
      author : newAuthor,
      url : newUrl,
      likes : 0
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        notify(`Added ${newTitle}`, 'success')
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
      })
      .catch(error => {
        notify(error.response.data.error, 'error')
      })
  }

  const upvoteBlog = id => {
    console.log(id)

    const blogToUpdate = blogs.find(b => b.id === id);
    
    const updatedBlog = {
      ...blogToUpdate,
      likes : blogToUpdate.likes + 1
    }

    console.log(updatedBlog)

    blogService
      .update(id, updatedBlog)
      .then(returnedBlog => {
        if (returnedBlog) {
          console.log(returnedBlog)
          setBlogs(blogs.map(b => b.id !== id ? b : returnedBlog))
        }
      })
      .catch(error => {
        console.error(error)
      })
  }  

  return (
    <div>

      <h1>Blog list</h1>
      
      <Notification message={notification.message} type={notification.type} />

      {user === null
        ? <>
          <h2>Login</h2>
          <LoginForm
            handleLogin={handleLogin}
            newUsername={newUsername}
            handleUsernameChange={handleUsernameChange}
            newPassword={newPassword}
            handlePasswordChange={handlePasswordChange}
          />
        </>
        : <>
          <p>Logged in as {user.name}</p>
          <button onClick={() => { window.localStorage.clear(); setUser(null) }}>Logout</button>

          <BlogList
            blogs={blogs}
            handleVote={upvoteBlog}
          />
    
          <h2>Add new Blog</h2>
          <BlogForm
            handleSubmit={addBlog}
            newTitle={newTitle}
            handleTitleChange={handleTitleChange}
            newAuthor={newAuthor}
            handleAuthorChange={handleAuthorChange}
            newUrl={newUrl}
            handleUrlChange={handleUrlChange}
          />
        </>
      }

    </div>
  )
}

export default App