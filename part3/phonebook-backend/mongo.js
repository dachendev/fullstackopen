const mongoose = require('mongoose')

const [password, newName, newNumber] = process.argv.slice(2)

if (!password) {
  console.log('give password as an argument')
  process.exit(1)
}

const url = `mongodb+srv://dachendev:${password}@cluster0.f0kb3.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (newName && newNumber) {
  const person = new Person({
    name: newName,
    number: newNumber,
  })

  person.save().then((addedPerson) => {
    console.log(`added ${addedPerson.name} number ${addedPerson.number} to phonebook`)
    mongoose.connection.close()
  })

  process.exit(1)
}

// else

Person.find({}).then((people) => {
  console.log('phonebook:')
  people.forEach((p) => console.log(`${p.name} ${p.number}`))
  mongoose.connection.close()
})