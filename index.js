// https://github.com/motdotla/dotenv#readme
require('dotenv').config()
// Import express module
const express = require('express')
// create express application
const app = express()
// from ./models/person.js, imports our mongoose model,
// which represents the persons collection in mongoDB
// into Person variable, the model is a constructor function
// from which we can make objects that are then mapped as documents to mongoDB
const Person = require('./models/person')

const morgan = require('morgan')
const cors = require('cors')

/// MIDDLEWARE order is important

// Middleware, serves static files in this case the build copied
// from our frontend repository to '/index.html' or '/'
// https://expressjs.com/en/starter/static-files.html
app.use(express.static('build'))

// Middleware, incoming requests are automatically converted to JSON Objects.
// this Middleware must come before routes and other Middleware that depend
// on access to the body of the request
app.use(express.json())

// Middleware, Cross-Origin Resource Sharing
// https://github.com/expressjs/cors
// allow all requests made to this server
app.use(cors())

// create custom token for logging, here using app.use(express.json())
// to access body from the requests JSON object and logging it
morgan.token('body', function(request) {
  return JSON.stringify(request.body, null, 2)
})

// Middleware, HTTP request logger https://github.com/expressjs/morgan
// can log to console or other files
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/// ROUTES

// Model.find(), mongoose model (collection) method, {} === all
app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person){
        response.json(person)
      } else {
        // correct format but not found
        response.status(404).end()
      }
    })
    // if ID doesn't match the mongo identifier format
    // the promise will return rejected and be caught.
    // no param in next() => continue to next route/middleware
    // with param => go to error handler middleware
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person
    .find({})
    .then(persons => {
      let totalPeople = persons.length
      response.send(`<p>This phonebook has ${totalPeople} people</p> <p>${new Date()}</p>`)
    })
})

app.post('/api/persons', (request, response, next) => {

  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(newEntry => {
      response.json(newEntry)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      // Prints what was deleted to console
      console.log(result)
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  // body of the request
  const body = request.body
  // Pass a regular object, with updated values
  const person = {
    name: body.name,
    number: body.number
  }

  // { new: true } changes the return of findByIdAndUpdate()
  // to the updated object rather than the initial query
  // runValidators: true, update validators are off by default
  // specify context: 'query' for access to this
  // update validation only runs on updated paths
  // https://mongoosejs.com/docs/validation.html
  Person
    .findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
    .then(updatedNumber => {
      // The server responds 200 null when updating non-existent resources
      // which is not ideal for error checking on the frontend
      // if null, null is falsy and evaluates to false
      if (updatedNumber) {
        response.json(updatedNumber)
      } else {
        // correct format but not found
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

/// ENDING MIDDLEWARE

// custom Middleware just a function that has access
// to the request/response objects and next()
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// If a request doesn't match any of the
// HTTP method/route combinations defined above
// this middleware gets called
// which terminates the request-response cycle
// by calling res.send()
// https://expressjs.com/en/guide/routing.html

// must come after all routes and before errorhandler middleware
// because it responds to any request with - 404 unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {

  console.error(error.message)

  // errors passed by next(error)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))