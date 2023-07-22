const mongoose = require('mongoose')
require('dotenv').config()
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3
  },
  number: {
    type: String,
    minLength: 8,
    validate:{
      validator: function(v) {
        return /\d{2,3}-\d*/.test(v);
      }
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
