describe('Blog app', function() {

  const testUser = {
    name: 'Test User',
    username: 'testuser',
    password: '123'
  }
  const testUser2 = {
    name: 'Test User 2',
    username: 'testuser2',
    password: '123'
  }

  const blogs = [
    {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    },
    {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html'
    },
    {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
    }
  ]

  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, testUser)
    cy.visit('')
  })


  it('Login form is shown by default', function() {
    cy.contains('Login')
  })


  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type(testUser.username)
      cy.get('#password').type(testUser.password)
      cy.get('#submitLogin').click()

      cy.get('html').should('contain', `Logged in as ${testUser.name}`)
    })

    it('fails with wrong credentials and red notification is displayed', function() {
      cy.get('#username').type('zzz')
      cy.get('#password').type('999')
      cy.get('#submitLogin').click()

      cy.get('.notification')
        .should('contain', 'Wrong credentials')
        .should('have.class', 'error')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
        .should('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Logged in as')
    })
  })


  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: testUser.username, password: testUser.password })
    })

    it('a blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Canonical string reduction')
      cy.get('#author').type('Edsger W. Dijkstra')
      cy.get('#url').type('http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')
      cy.get('#submitBlog').click()

      cy.get('.notification')
        .should('contain', 'Added Canonical string reduction')
        .should('have.class', 'success')
        .should('have.css', 'color', 'rgb(0, 128, 0)')
        .should('have.css', 'border-style', 'solid')

      cy.get('html').should('contain', 'Canonical string reduction')
    })

    describe('and if the blog list is not empty', function() {
      beforeEach(function() {
        cy.createBlog(blogs[0])
        cy.createBlog(blogs[1])
        cy.request('POST', `${Cypress.env('BACKEND')}/users/`, testUser2)
        cy.login({ username: testUser2.username, password: testUser2.password })
        cy.createBlog(blogs[2])
        cy.login({ username: testUser.username, password: testUser.password })
      })

      it('a blog can be liked', function() {
        cy.get('.blog:first').as('firstBlog')
        cy.get('@firstBlog').contains('show').click()
        cy.get('@firstBlog').find('.likes-count').should('contain', '0')
        cy.get('@firstBlog').find('.vote-blog').click()
          .parent().find('.likes-count').should('contain', '1')
      })

      it('a blog can be deleted if it was created by the same user', function() {
        cy.get('.blog-list').should('contain', blogs[0].title)

        cy.get('.blog:first').as('firstBlog')
        cy.get('.blog:first').should('contain', blogs[0].title)
        cy.get('@firstBlog').contains('show').click()
        cy.get('@firstBlog').contains('remove this blog').click()

        cy.get('.blog-list').should('not.contain', blogs[0].title)
        cy.get('.notification')
          .should('contain', `Deleted ${blogs[0].title}`)
          .should('have.class', 'success')
      })

      it('there is no button to delete a blog that was not created by the same user', function() {
        cy.get('.blog:first').contains('show').click()
        cy.get('.blog:first').should('contain', 'remove this blog')
        cy.get('.blog:last').contains('show').click()
        cy.get('.blog:last').should('not.contain', 'remove this blog')
      })

      it('blog list is ordered descending by likes', function() {
        cy.get('.blog:first').as('firstBlog')
        cy.get('@firstBlog').contains('show').click()
        cy.get('@firstBlog').find('.vote-blog').click().click()
          .parent().find('.likes-count').should('contain', '2')

        cy.get('.blog:last').as('lastBlog')
        cy.get('@lastBlog').contains('show').click()
        cy.get('@lastBlog').find('.vote-blog').click().click().click()
          .parent().find('.likes-count').should('contain', '3')

        const likeList = []
        cy.get('.likes-count').each(($l) => likeList.push($l.text()))
        cy.wrap(likeList).should('deep.equal', ['3', '2', '0'])
        cy.wrap(likeList).should('not.deep.equal', ['2', '0', '3'])
      })
    })
  })

})