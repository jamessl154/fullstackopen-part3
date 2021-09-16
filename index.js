require('dotenv').config()
// Import express module
const express = require('express')
// create express application
const app = express()
// from ./models/person.js, imports our mongoose model, 
// which represents the persons collection in mongoDB
// into Person variable
const Person = require('./models/person')

const morgan = require('morgan')
const cors = require('cors')

/// MIDDLEWARE order is important

// Middleware, serves static files in this case the build copied
// from our frontend repository
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
// to access body from the requests JSON object
morgan.token('body', function(request, response) {
  return JSON.stringify(request.body, null, 2)
})

// Middleware, HTTP request logger https://github.com/expressjs/morgan
// can log to console or other files
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/// ROUTES

// Model.find(), mongoose model (collection) method, {} === all
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
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
    const number = persons.length
    response.send(`<p>Phonebook has info for ${number} people</p> <p>${new Date()}</p>`)
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing'
    })
  }

  // if (Person.find({ name: body.name }))
  // TODO test entries for same name, collation : strength in mongoose schema

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(newEntry => {
    response.json(newEntry)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response) => {
  // body of the request
  const body = request.body
  // Pass a regular object, with updated values
  const person = {
    name: body.name,
    number: body.number
  }

  // { new: true } changes the return of findByIdAndUpdate() 
  // to the updated object rather than the initial query
  Person
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedNumber => {
      response.json(updatedNumber)
    })
    .catch(error => next(error))
})

// ENDING MIDDLEWARE order important

// custom Middleware
// just a function that has access to the request/response objects and next()
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// If a request doesn't match any of the
// HTTP method/route combinations defined above
// this middleware gets called
// and terminates the request-response cycle
// by calling res.send()
// https://expressjs.com/en/guide/routing.html

// must come after all routes and before errorhandler middleware
// because it responds to any request with - 404 unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {

  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})