const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))
morgan.token('postBody', (req, res) => JSON.stringify(req.body))
app.use(cors())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
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

app.get('/api/persons', (request, response) => {
  response.json(persons)
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
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  person ? response.json(person) : response.status(404).send('Error: person not found')
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  // console.log(`Id: ${id}`)
  persons = persons.filter(person => person.id !== id)
  console.log(persons)
  response.status(200).send({"id": id})
})

const generateId = () => Math.round(Math.random() * 10000000)

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name and number are required'
    })
  } else if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name already in database'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})