const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const url = process.env.MONGODB_URI
mongoose.connect(url)

const Note = mongoose.model('Note', {
    content: String,
    date: Date,
    important: Boolean
})

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

const note = new Note({
    content: 'HTML on helppoa',
    date: new Date(),
    important: true
})

const saveNote = () => {
    return note
        .save()
        .then(() => {
            console.log('note saved!')
        })
}

const findAllNotes = () => {
    return Note
        .find({})
        .then(result => {
            result.forEach(note => {
                console.log(note)
            })
        })
}

const savePerson = (person) => {
    return person
        .save()
        .then(() => console.log(`Henkilö ${person.name} numerolla ${person.number} tallennettu!`))
}

const findAllPeople = () => {
    return Person
        .find({})
        .then(result => {
            console.log('Puhelinluettelo')
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
        })
}

const close = () => {
    mongoose.connection.close()
}

/*
save().then(() =>
    findAll().then(() =>
        close())
)
*/

if (process.argv.length !== 4) {
    findAllPeople().then(() => close())
} else {
    const newPerson = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })
    savePerson(newPerson).then(() => close())
}

