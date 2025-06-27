require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const app = express()
var morgan = require('morgan')

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))
morgan.token('postBody', (req, _res) => JSON.stringify(req.body))
app.use(express.static('dist'))

//#region ROUTES

//#region GET ROUTES
app.get('/', (request, response) => {
  response.send('<h1>Part3 phonebook</h1>')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }).catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  const date = new Date()
  Person.countDocuments({}).then(count => {
    response.send(
      `<p>Phonebook has info for ${count} people.</p>
         <p>${date}</p>`
    )
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})
//#endregion

//#region OTHER ROUTES
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name and number are required'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

// update an entry
app.put('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        console.log('The person you\'re trying to update does not exists on the server')
        return response.status(404).end()
      }

      person.number = request.body.number

      return person.save()
        .then(updatedNote => {
          response.json(updatedNote)
        })
    })
    .catch((error) => {
      return next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(200).send({ id: request.params.id })
    })
    .catch(error => next(error))
})
//#endregion

//#endregion

//#region ERROR HANDLING

const errorHandler = (error, request, response, next) => {
  console.log('errorHandler activated!')
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  console.log('404 unknownEndpoint activated! Nothing to see here!')
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

//#endregion

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})