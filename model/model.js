const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/chat_project').then(() => {
    console.log('------------Database connected------------');
})
    .catch((error) => {
        console.error('Database connection error:', error);
    });

const userSchema = require('./userSchema')
const messageSchema = require('./messageSchema')

const User = mongoose.model('user', userSchema)
const Message = mongoose.model('message', messageSchema)

module.exports = { User, Message }