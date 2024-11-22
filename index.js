const express = require('express')
const router = require('./router/router')
const passport = require('passport')
const user = require('./router/user')
const { isLogin, isNotLogin } = require('./middleware/middleware')
const { User, Message } = require('./model/model')
require('dotenv').config()
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

io.on('connection', (socket) => {
    socket.on('join', (userId) => {
        console.log("User joined room with ID:", userId);
        socket.join(userId)
    })
    socket.on('newMess', async (message, from, to) => {
        const newMessage = await Message.create({ message, from, to })
        socket.to(to).emit('showMess', [newMessage]);
    })
    socket.on('getMess', async (userID, friend) => {
        try {
            const messages = await Message.find({
                $or: [
                    { from: userID, to: friend },
                    { from: friend, to: userID }
                ]
            });
            socket.emit('showMess', messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            socket.emit('error', { message: 'Failed to fetch messages' });
        }
    });

})

const port = process.env.PORT || 3000
const secret = process.env.SECRET_KEY



app.set('view engine', 'hbs')
require('hbs').registerPartials(__dirname + '/views/component/')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(__dirname + '/public'))
app.use(
    require('express-session')({
        secret,
        resave: false,
        saveUninitialized: true
    })
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/', router)
app.use('/user', isNotLogin, user)


server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})  