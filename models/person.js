const mongoose = require('mongoose')
// npm install mongoose-unique-validator
const uniqueValidator = require("mongoose-unique-validator")

// environment variable
const url = process.env.MONGODB_URI

console.log("connecting to ", url)

// mongoose promise chain
mongoose.connect(url)
  .then(result => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connecting to MongoDB: ", error.message)
  })

// Mongoose schema. Athough not necessary for mongoDB
// these schemas make our collections of documents more structured
const personSchema = new mongoose.Schema({
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test
  // https://regex101.com/
  // https://stackoverflow.com/a/50177224
  // /^([.,\/ -]*\d[.,\/ -]*){8,}$/ RegExp matches a line that contains
  // the capturing group () at least 8 times and nothing else that that isn't a match.
  // The group is a [0-9] char that has 0 or more ".,/- " chracters on either side
  // so 12345678 or -1-2-3-4-5-6-7-8- are accepted e.t.c.
  name: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => {
        // .test() returns true if matches RegExp
        // v refers to the document
        return /^([.,\/ -]*\d[.,\/ -]*){8,}$/.test(v)
      },
      message: "Number must contain at least 8 digits, number can only contain digits and the ' -.,/' characters"
    },
    minlength: 8
  }
})

// Apply the uniqueValidator plugin to personSchema
personSchema.plugin(uniqueValidator)

// removes default _id and __v, creates .id from __id as a string
// each person inherits this method from the personSchema. It gets called when
// the object is converted to JSON
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

// The variable assigned mongoose.model becomes a constructor function
// that creates a new JS object based on params
// inheriting all properties and methods including save(), find() e.t.c.
module.exports = mongoose.model('Person', personSchema)