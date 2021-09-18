const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://James:${password}@cluster0.1rbrw.mongodb.net/phonebook-db?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// method model is a constructor function,
// creates new JS object based on params
// inheriting all properties and methods
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {

  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => console.log(person.name, person.number))
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  // mongoose model-specific method save to db
  // in promise chain
  person.save().then(() => {
    console.log('Added name: ', process.argv[3],', number: ', process.argv[4], ' to the phonebook')
    mongoose.connection.close()
  })
}