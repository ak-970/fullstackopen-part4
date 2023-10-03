const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

personsRouter.get('/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person.name) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
      // response.status(200).end()
    })
    .catch(error => next(error))
})


personsRouter.post('/', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  Person.find({}).then(persons => {
    if (persons.find(p => p.name === body.name)) {
      return response.status(400).json({
        error: 'name already exists but must be unique'
      })
    } else {
      person.save()
        .then(savedPerson => {
          response.json(savedPerson)
        })
        .catch(error => next(error))
    }
  })
})


personsRouter.put('/:id', (request, response, next) => {
  const {
    name,
    number
  } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name,number },
    { new: true,
      runValidators: true,
      context: 'query'
    }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

module.exports = personsRouter