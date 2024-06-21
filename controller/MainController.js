const { validationResult } = require("express-validator")
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const { User } = require("../model/model")
const { transporter } = require('../emailService/config')

class MainController {
    constructor() { throw new Error("MainController is abstract class, cannot create an object from it") }

    static async loginPage(req, res) { res.render('login') }

    static async registerPage(req, res) { res.render('register') }

    static async verifyPage(req, res) {
        res.render('verifyEmail')
    }

    static async verify(req, res) {
        const user = await User.findOne({ email: req.query.email });
        if (user) {
            await User.findByIdAndUpdate(user.id, {
                isVerify: true,
                emailToken: null
            });
            res.redirect('/verifypage');
        } else {
            res.status(404).render('notFound');
        }
    }
    static async register(req, res) {
        const { validationResult } = require('express-validator');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorsObj = {};
            errors.array().forEach(err => {
                errorsObj[err.path + "Err"] = err.msg;
            });
            req.session.errors = errorsObj
            res.render('register', { errorsObj });
        }
        else {
            delete req.session.errors

            const { name, surname, nickname, phonenumber, email, password } = req.body
            const hashedPass = bcrypt.hashSync(password, 10)
            const emailToken = uuid.v4()

            const user = await User.create({
                name,
                surname,
                nickname,
                phonenumber,
                email,
                password: hashedPass,
                emailToken
            })

            const url = `http://localhost:3000/verify?email=${user.email}&token=${emailToken}`;
            const mailOptions = {
                from: 'hammkrtchyan7@gmail.com',
                to: 'hammkrtchyan7@gmail.com',
                subject: 'Thank you for registering our site ',
                html: `Welcome dear ${user.name}, please press <a href="${url}">here</a> To pass the verification`
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) console.log(error)
            })
            res.render('checkEmail')
        }
    }
    static async loginValidation(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorsObj = {};
            errors.array().forEach(err => {
                errorsObj[err.path + "Err"] = err.msg;
            });
            req.session.errors = errorsObj
            res.render('login', { errorsObj })
        }
        else {
            delete req.session.errors
            next()
        }
    }
}

module.exports = MainController