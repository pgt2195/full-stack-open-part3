const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
// console.log(process.argv)
// console.log(process.argv.length)

const url = `mongodb+srv://paulgrossetete:${password}@full-stack-open-part3.ggkc4af.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=full-stack-open-part3`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    const newName = process.argv[3]
    const newNumber = process.argv[4]

    const person = new Person({
        name: newName,
        number: newNumber,
    })

    person.save().then(result => {
        console.log(`Added ${newName} number ${newNumber} to phonebook`)
        mongoose.connection.close()
    })
} else {
    mongoose.connection.close()
    console.log('Usage: \nLaunch program with command line arguments\n',
        'password to see all entries\n',
        'password + name + number to add a new entry')
}