const infoRouter = require('express').Router()
const Person = require('../models/person')

infoRouter.get('/', (request, response) => {
  // response.send('<p>hello world</p>')
  Person.find({}).then(persons => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
  })
})

module.exports = infoRouter