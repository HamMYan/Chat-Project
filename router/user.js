const user = require('express').Router()

user.get('/profile',(req,res) => {
    res.render('profile',req.user)
})

module.exports = user