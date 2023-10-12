import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  const testBlog = {
    title: 'Test Blog Title',
    author : 'Test Blog Author',
    url : 'https://test-blog-url-com'
  }

  let mockCreateBlog
  let container
  let user

  beforeEach(() => {
    mockCreateBlog = jest.fn()
    container = render(<BlogForm
      createBlog={mockCreateBlog}
    />).container
    user = userEvent.setup()
  })

  test('calls the event handler it received as props with the right details when a new blog is created', async () => {
    const inputs = ['title', 'author', 'url']
    const submit = container.querySelector('input[type="submit"]')

    await user.type(container.querySelector(`#${inputs[0]}`), testBlog[inputs[0]])
    await user.type(container.querySelector(`#${inputs[1]}`), testBlog[inputs[1]])
    await user.type(container.querySelector(`#${inputs[2]}`), testBlog[inputs[2]])

    await user.click(submit)

    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    inputs.forEach(input => {
      expect(mockCreateBlog.mock.calls[0][0][input]).toBe(testBlog[input])
    })
  })
})