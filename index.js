const express = require('express')
const router = require('./router/router')
const { default: mongoose } = require('mongoose')
const passport = require('passport')
const user = require('./router/user')
require('dotenv').config()
const app = express()

const port = process.env.PORT || 3000
const secret = process.env.SECRET_KEY

app.set('view engine','hbs')
require('hbs').registerPartials('/view/component')

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
app.use('/user', user)

app.listen(port,() => {
    console.log(`Server running at http://localhost:${port}`);
})