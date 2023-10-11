import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Notification from './Notification'

describe('<Notification />', () => {
  test('renders content', () => {
    const message = 'Component testing is done with react-testing-library'

    const { container } = render(<Notification message={message} type='error' />)

    const div = container.querySelector('.notification')
    expect(div).toHaveTextContent(
      'Component testing is done with react-testing-library'
    )

    // const element = screen.getByText('Component testing is done with react-testing-library')
    // expect(element).toBeDefined()
  })
})