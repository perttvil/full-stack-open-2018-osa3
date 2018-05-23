const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Note = require('./models/note')
const Person = require('./models/person')

const app = express()
app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
morgan.token('request-content', function (req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :request-content :status :res[content-length] - :response-time ms'))

const formatNote = (note) => {
    return {
        content: note.content,
        date: note.date,
        important: note.important,
        id: note._id
    }
}

const formatPerson = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

app.get('/api/notes', (request, response) => {
    Note
        .find({})
        .then(notes => {
            response.json(notes.map(formatNote))
        })
})

app.get('/api/notes/:id', (request, response) => {
    Note
        .findById(request.params.id)
        .then(note => {
            response.json(formatNote(note))
        })
        .catch(error => {
            console.log(error)
            response.status(404).end()
        })
})

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (body.content === undefined) {
        return response.status(400).json({error: 'content missing'})
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    })

    note
        .save()
        .then(savedNote => {
            response.json(formatNote(savedNote))
        })
        .catch(error => {
            console.log(error)
            response.status(503).end()
        })
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    Note.findByIdAndRemove(id)
        .then(() => response.status(204).end())
        .catch(error => {
            console.log(error)
            response.status(404).end()
        })
})

app.put('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const updatedNote = request.body
    Note.findByIdAndUpdate(id, updatedNote, {new: true})
        .then(() => response.json(updatedNote))
        .catch(error => {
            console.log(error)
            response.status(404).end()
        })
})

/*
const generateId = () => {
    const maxId = notes.length > 0 ? notes.map(n => n.id).sort().reverse()[0] : 1
    return maxId + 1
}
*/

/** Info */
app.get('/info', (req, res) => {
    res.send(`<h1>Puhelinluettelossa on ${persons.length} henkilön tiedot</h1><code>${new Date()}</code>`)
})

/** Person endpoints */

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons.map(formatPerson))
        })
})

app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            response.json(formatPerson(person))
        })
        .catch(error => {
            console.log(error)
            response.status(404).end()
        })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findByIdAndRemove(id)
        .then(() => response.status(204).end())
        .catch(error => {
            console.log(error)
            response.status(404).end()
        })

})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({error: 'name missing'})
    } else if (body.number === undefined) {
        return response.status(400).json({error: 'number missing'})
    } else {
        /*
        if (persons.find(p => p.name === body.name) !== undefined) {
            return response.status(400).json({error: 'duplicate name'})
        }
        */
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person
        .save()
        .then(savedPerson => {
            response.json(formatPerson(savedPerson))
        })
        .catch(error => {
            console.log(error)
            response.status(503).end()
        })
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