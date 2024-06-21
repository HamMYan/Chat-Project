const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/chat_project');

const userSchema = require('./userSchema')

const User = mongoose.model('user', userSchema)

module.exports = { User }