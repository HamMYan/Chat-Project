const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/chat_project');

const userSchema = require('./userSchema')
const messageSchema = require('./messageSchema')

const User = mongoose.model('user', userSchema)
const Message = mongoose.model('message', messageSchema)

module.exports = { User }