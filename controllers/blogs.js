const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const userValidator = require('../utils/middleware').userValidator


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})


blogsRouter.delete('/:id', userValidator, async (request, response) => {

  const blogId = request.params.id
  const user = request.user
  const blog = await Blog.findById(blogId)

  if (blog === null) {
    return response.status(204).json({ error: 'blog id does not exist' })
  }

  if (!(user.id.toString() === blog.user.toString())) {
    return response.status(401).json({ error: 'user invalid' })
  }

  await Blog.findByIdAndRemove(blogId)

  user.blogs = user.blogs.filter(blog => blog._id.toString() !== blogId)

  await user.save()

  response.status(204).end()
})


blogsRouter.post('/', userValidator, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  await savedBlog.populate('user', { username: 1, name: 1 })

  response.status(201).json(savedBlog)
})


blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes, /*user*/ } = request.body

  const updatedBlog = await Blog
    .findByIdAndUpdate(
      request.params.id,
      {
        title,
        author,
        url,
        likes,
        // user
      },
      {
        new: true,
        runValidators: true,
        context: 'query'
      }
    )
    .populate('user', { username: 1, name: 1 })

  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
  // id doesn't exist, updatedBlog is null
    response.status(404).end()
  }
})


module.exports = blogsRouter