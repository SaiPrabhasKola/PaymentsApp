require('dotenv').config()

const url = process.env.DB_URL

const mongoose = require('mongoose')
console.log(url)

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    }
})

const UserModel = mongoose.model('UserModel', UserSchema)

module.exports = {
    UserModel
}
