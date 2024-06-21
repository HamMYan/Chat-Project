const nodemailer = require('nodemailer')

module.exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'hammkrtchyan7@gmail.com',
        pass: 'ooxu dajg vhms fcyj'
    }
})