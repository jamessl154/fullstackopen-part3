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
    phoneNumber: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {

    Person.find({}).then(result => {
        console.log("Phonebook:")
        result.forEach(person => 
            console.log(person.name, person.phoneNumber)
        )
        mongoose.connection.close()
    })
}

if (process.argv.length === 5) {

    const person = new Person({
        name: process.argv[3],
        phoneNumber: process.argv[4],
    })
    
    person.save().then(result => {
        console.log("Added name: ", process.argv[3],", number: ", process.argv[4], " to the phonebook")
        mongoose.connection.close()
    })
}