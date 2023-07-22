const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('wrong number of arguments.\nExample: node mongo.js [password] Danik 12345678\nnode mongo,js [password]')
  process.exit(1)
}

const password = process.argv[2]
let name = null
let number = null
if (process.argv.length === 5){

    name = process.argv[3]
    number = process.argv[4]
}

const url =
  `mongodb+srv://fullstack:${password}@cluster0.n08pxx8.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)
if (process.argv.length === 5){
    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(result => {
        console.log(`added ${name} nubmer ${number} to phonebook\n ${result}`)
        mongoose.connection.close()
    })
}
else if (process.argv.length === 3){
    console.log("Phonebook:")
    Person.find({}).then(result => {
        result.forEach(note => {
          console.log(`${note.name} ${note.number} ${note.id}`)
        })
        mongoose.connection.close()
  })
}
