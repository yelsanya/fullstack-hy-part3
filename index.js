const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')
const helmet = require("helmet");
const cors = require('cors')

let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323527"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

morgan.token('body', (req, res) => {
	if (req.method == 'POST') {
		return JSON.stringify(req.body)
	}
	else {
		return ''
	}
})

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(helmet());

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
	response.send(`<p>Phonebook has info of ${persons.length} people</p>\
				   <p>${Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
	const id = request.params.id
	for (let i = 0; i < persons.length; i++){
		if (persons[i].id === +id){
			response.send(`<p>Name: ${persons[i].name}</p>\
						   <p>Number: ${persons[i].number}</p>`)
		}
	}
	response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
	const id = request.params.id
	persons = persons.reduce((newPersons, person) => {
		if (person.id !== +id){
			newPersons.push(person)
		}
		return newPersons
	}, [])
	response.redirect('/api/persons')
})

app.post('/api/persons', (request, response) => {
	if (!request.body.name || request.body.name === "" ||
		!request.body.number || request.body.number === "") {
		response.status(500)
		response.send({error: "The name or number is missing"})
		return
	}
	for (let i = 0; i < persons.length; i++){
		if (persons[i].name === request.body.name){
			response.status(500)
			response.send({error: "name must be unique"})
			return
		}
	}
	let id = Math.floor(Math.random()*10**10)
	let newPerson = {
		id: id,
		name: request.body.name,
		number: request.body.number
	}
	persons.push(newPerson)
	response.send(newPerson)
})

const PORT = 3001
const ADDR = '0.0.0.0'
app.listen(PORT, ADDR, () => {
  console.log(`Server running on ${ADDR}:${PORT}`)
})
