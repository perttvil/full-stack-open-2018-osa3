const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.static('build'))

const logger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
morgan.token('request-content', function (req, res) {
    return JSON.stringify(req.body)
})


app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :request-content :status :res[content-length] - :response-time ms'))
// app.use(logger)

let notes = [
    {
        id: 1,
        content: 'HTML on helppoa',
        date: '2017-12-10T17:30:31.098Z',
        important: true
    },
    {
        id: 2,
        content: 'Selain pystyy suorittamaan vain javascriptiä',
        date: '2017-12-10T18:39:34.091Z',
        important: false
    },
    {
        id: 3,
        content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
        date: '2017-12-10T19:20:14.298Z',
        important: true
    }
]

let persons = [
    {id: 1, name: 'Arto Hellas', number: '040-123456'},
    {id: 2, name: 'Martti Tienari', number: '040-123456'},
    {id: 3, name: 'Arto Järvinen', number: '040-123456'},
    {id: 4, name: 'Lea Kutvonen', number: '040-123456'}
]


/*
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})
*/

app.get('/api/notes', (req, res) => {
    res.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)

    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.put('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const updatedNote = request.body
    const note = notes.find(note => note.id === id)
    if (note) {
        notes = notes.map(n => n.id !== id ? n : updatedNote)
        response.json(updatedNote)
    } else {
        response.status(404).end()
    }
})

const generateId = () => {
    const maxId = notes.length > 0 ? notes.map(n => n.id).sort().reverse()[0] : 1
    return maxId + 1
}

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (body.content === undefined) {
        return response.status(400).json({error: 'content missing'})
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId()
    }

    notes = notes.concat(note)

    response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

/** Info */
app.get('/info', (req, res) => {
    res.send(`<h1>Puhelinluettelossa on ${persons.length} henkilön tiedot</h1><code>${new Date()}</code>`)
})

/** Person endpoints */

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({error: 'name missing'})
    } else if (body.number === undefined) {
        return response.status(400).json({error: 'number missing'})
    } else {
        if (persons.find(p => p.name === body.name) !== undefined) {
            return response.status(400).json({error: 'duplicate name'})
        }
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 999999999999999)
    }

    persons = persons.concat(person)
    response.json(person)
})

/** This has to be after endpoints, to be run in right order */
const error = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})