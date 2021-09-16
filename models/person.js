const mongoose = require('mongoose')

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
  name: String,
  number: String,
})

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

// 1st param name of model, lowercase plural is name of colection
// 2nd param schema in variable
module.exports = mongoose.model('Person', personSchema)