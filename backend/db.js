require('dotenv').config()

const url = process.env.DB_URL

const mongoose = require('mongoose')
const { number } = require('zod')
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

const AccountSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    },
    Amount: {
        type: number,
        required: true
    }
})

const UserModel = mongoose.model('UserModel', UserSchema)

const AccountModel = mongoose.model('AccountModel', AccountSchema)
module.exports = {
    UserModel,
    AccountModel
}
