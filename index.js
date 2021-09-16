require('dotenv').config()
// Import express module
const express = require('express')
// create express application
const app = express()
// from ./models/person.js, imports our mongoose model, 
// which represents the persons collection in mongoDB
// into Person variable
const Person = require('./models/person')

// Middleware, HTTP request logger https://github.com/expressjs/morgan
// can log to console or other files
const morgan = require('morgan')

// Middleware, Cross-Origin Resource Sharing
// https://github.com/expressjs/cors
const cors = require('cors')
// allow all requests made to this server
app.use(cors())

// Middleware, incoming requests are automatically converted to JSON Objects
// used here so we can access body of request
app.use(express.json())

// Middleware, serves static files in this case the build copied
// from our frontend repository
// https://expressjs.com/en/starter/static-files.html
app.use(express.static('build'))

// create custom token for logging, here using app.use(express.json()) 
// to access body from the requests JSON object
morgan.token('body', function(request, response) {
  return JSON.stringify(request.body, null, 2)
})

// custom formatting for morgan
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Model.find(), mongoose model (collection) method, {} === all
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
    Person
    .findById(request.params.id)
    .then(person => {
      if (person){
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
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

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})