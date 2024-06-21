const Schema = require("mongoose").Schema

const userSchema = new Schema({
    name: String,

    surname: String,
    
    nickname: {
        type: String,
        unique: true
    },
    phonenumber: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },

    password: String,

    emailToken: String,

    isVerify: {
        type: String,
        default: false
    }
})

module.exports = userSchema