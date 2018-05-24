const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
    {
        content: 'HTML on helppoa',
        important: false
    },
    {
        content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
        important: true
    }
]

const nonExistingId = async () => {
    const note = new Note()
    await note.save()
    await note.remove()

    return note._id.toString()
}

const notesInDb = async () => {
    const notes = await Note.find({})
    return notes.map(Note.format)
}

const usersInDb = async () => {
    const users = await User.find({})
    return users
}

module.exports = {
    initialNotes, nonExistingId, notesInDb, usersInDb
}