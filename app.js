const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const personsRouter = require('./controllers/persons')
const infoRouter = require('./controllers/info')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
// const morgan = require('morgan')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })


app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
// app.use(morgan(function(tokens, request, response) {
//   return [
//     tokens.method(request, response),
//     tokens.url(request, response),
//     tokens.status(request, response),
//     tokens.res(request, response, 'content-length'),
//     '-',
//     tokens['response-time'](request, response), 'ms',
//     JSON.stringify(request.body)
//   ].join(' ')
// }))


app.use('/api/persons', personsRouter)
app.use('/info', infoRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler) // this has to be the last loaded middleware!


module.exports = app