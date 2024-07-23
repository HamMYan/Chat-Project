const user = require('express').Router()
const UserController = require('../controller/UserController')

user.get('/homePage', UserController.homePage)
user.get('/logOut',UserController.logOut)

module.exports = user