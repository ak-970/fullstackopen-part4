import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {

  const testUser = {
    token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5ldWVyVXNlciIsImlkIjoiNjUyNDExYmFhNmFkMzQ3OThkZTJmYTZhIiwiaWF0IjoxNjk2ODYyNjU2fQ.Xk078pwuhUPhhVT3uAaE1BLWBusKzR9Vq_RsEBRssWU',
    username : 'neuerUser',
    name : 'Neuer User'
  }
  const testBlog = {
    title: 'Test Blog Title',
    author : 'Test Blog Author',
    url : 'https://test-blog-url-com',
    likes : 2,
    user : testUser
  }

  let mockHandleVote
  let mockDeleteBlog
  let container
  let user

  beforeEach(() => {
    mockHandleVote = jest.fn()
    mockDeleteBlog = jest.fn()
    container = render(<Blog
      blog={testBlog}
      handleVote={mockHandleVote}
      deleteBlog={mockDeleteBlog}
      user={testUser}
    />).container
    user = userEvent.setup()
  })

  test('renders the blog\'s title and author, but does not render its URL or number of likes by default', () => {
    const elementsToShowByDefault = ['title', 'author']
    const elementsNotToShowByDefault = ['likes', 'user', 'url']

    elementsToShowByDefault.forEach(element => {
      expect(container).toHaveTextContent(testBlog[element])
      expect(container.querySelector(`.${element}`)).not.toHaveClass('hide')
    })

    elementsNotToShowByDefault.forEach(element => {
      expect(container).toHaveTextContent(element === 'user' ? testBlog.user.name : testBlog[element])
      expect(container.querySelector(`.${element}`)).toHaveClass('hide')
    })
  })

  test('the blog\'s URL and number of likes are shown when the button controlling the shown details has been clicked', async () => {
    const elementsToShowOnToggle = ['vote', 'user', 'url']

    const button = container.querySelector('.toggle-visibility')
    await user.click(button)

    elementsToShowOnToggle.forEach(element => {
      expect(container.querySelector(`.${element}`)).not.toHaveClass('hide')
    })
  })

  test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
    const button = container.querySelector('.vote-blog')
    await user.click(button)
    await user.click(button)
    expect(mockHandleVote.mock.calls).toHaveLength(2)
  })
})