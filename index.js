require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const app = express()
var morgan = require('morgan')

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))
morgan.token('postBody', (req, res) => JSON.stringify(req.body))
app.use(express.static('dist'))

let persons = []

//#region ROUTES

app.get('/', (request, response) => {
  response.send('<h1>Part3 phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const date = new Date()
  const length = persons.length
  response.send(
    `<p>Phonebook has info for ${length} people.</p>
    <p>${date}</p>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name and number are required'
    })
  } /* else if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name already in database'
    })
  } */

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    // TODO : ajouter le catch
})

//#endregion

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})