const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const db_person = require('./models/person')

morgan.token('body', (req) => {
    if (req.method === 'POST') {
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
app.use(helmet())

app.get('/api/persons', (request, response) => {
    db_person.find({}).then(result => {
        response.send(result)
    })
})

app.get('/info', (request, response) => {
    db_person.find({}).then(result => {
        response.send(`<p>Phonebook has info of ${result.length} people</p>\
				       <p>${Date()}`)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    db_person.findById(id).then(result => {
        if (result.length === 0){
            response.status(404).end()
        }
        else {
            console.log(result)
            response.send(result)
        }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    db_person.findByIdAndRemove(id).then(result => {
        console.log(result)
        response.status(204).end()
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    if (!request.body.name || request.body.name === '' ||
		!request.body.number || request.body.number === '') {
        response.status(500)
        response.send({error: 'The name or number is missing'})
        return
    }
    db_person.find({name: request.body.name}).then(result => {
        if (result.length !== 0){
            response.status(500)
            response.send({error: 'name must be unique'})
        }
        else {
            let newPerson = new db_person({
                name: request.body.name,
                number: request.body.number
            })
            newPerson.save().then(result => {
                response.send(result)
            }).catch(error => next(error))
        }
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    let person = {
        name: request.body.name,
        number: request.body.number
    }
    db_person.findByIdAndUpdate(id, person, {new: true}).then(updatedPerson => {
        response.json(updatedPerson)
    }).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError'){
        return response.status(400).send({error: error.message})
    }
    next(error)
}

app.use(errorHandler)

const PORT = 3001
const ADDR = '0.0.0.0'
app.listen(PORT, ADDR, () => {
    console.log(`Server running on ${ADDR}:${PORT}`)
})

