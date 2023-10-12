import { useState, useEffect, useRef } from 'react'

// components
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

// services
import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {

  // references
  const blogFormRef = useRef()


  // use states
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({ message : null, type : '' })


  // use effects
  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        setBlogs(initialBlogs)
        // console.log(initialBlogs)
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


  // method functions
  const notify = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ ...notification, message : null })
    }, 5000)
  }

  const login = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      notify('Wrong credentials', 'error')
    }
  }

  const logout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const createBlog = blogObject => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        notify(`Added ${blogObject.title}`, 'success')
      })
      .catch(error => {
        error.response.status === 401 && logout()
        notify(error.response.data.error, 'error')
      })
  }

  const upvoteBlog = id => {
    const blogToUpdate = blogs.find(b => b.id === id)

    const updatedBlog = {
      ...blogToUpdate,
      likes : blogToUpdate.likes + 1
    }

    blogService
      .update(id, updatedBlog)
      .then(returnedBlog => {
        if (returnedBlog) {
          setBlogs(blogs.map(b => b.id !== id ? b : returnedBlog))
        }
      })
      .catch(error => {
        console.error(error)
        notify(error.response.data.error, 'error')
      })
  }

  const deleteBlog = id => {
    const blogToDelete = blogs.find(blog => blog.id === id)

    const message = `Do you really want to delete "${blogToDelete.title}" by ${blogToDelete.author}`
    if (window.confirm(message)) {
      blogService
        .remove(id)
        .then(response => {
          setBlogs(blogs.filter(blog => blog.id !== id))
          notify(`Deleted ${blogToDelete.title}`, 'success')
        })
        .catch(error => {
          console.error(error)
          notify(error.response.data.error, 'error')
        })
    }
  }


  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)


  return (
    <div>

      <h1>Blog list</h1>

      <Notification message={notification.message} type={notification.type} />

      {user === null
        ? <>
          <h2>Login</h2>
          <LoginForm login={login} />
        </>
        : <>

          <section>
            <p>Logged in as {user.name} <button onClick={logout}>Logout</button></p>
          </section>

          <section>
            <Togglable buttonLabel='new blog' ref={blogFormRef}>
              <h2>Add new Blog</h2>
              <BlogForm
                createBlog={createBlog}
              />
            </Togglable>
          </section>

          <section>
            <BlogList
              blogs={sortedBlogs}
              handleVote={upvoteBlog}
              deleteBlog={deleteBlog}
              user={user}
            />
          </section>

        </>
      }

    </div>
  )
}

export default App