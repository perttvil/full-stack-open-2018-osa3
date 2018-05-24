const mongoose = require('mongoose')

const url = 'mongodb://fullstack:fullstack@ds211088.mlab.com:11088/fullstack-notes'

mongoose.connect(url)
mongoose.Promise = global.Promise

const Note = mongoose.model('Note', {
    content: String,
    date: Date,
    important: Boolean
})

Note
    .find({})
    .then(result => {
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })


/*
const note = new Note({
  content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
  date: new Date(),
  important: false
})

note
  .save()
  .then(response => {
    console.log('note saved!')
    mongoose.connection.close()
  })
*/