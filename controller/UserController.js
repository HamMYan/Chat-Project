const { validationResult } = require("express-validator");
const { User } = require("../model/model");
const bcrypt = require('bcrypt')



class UserController {
    constructor() { throw new Error("UserController is abstract class, cannot create an object from it") }

    static async homePage(req, res) {
        const user = req.user;
        const users = await User.find({ name: { $ne: user.name }, isVerify: true })
        res.render('homePage', { user, users });
    }

    static async logOut(req, res) {
        req.logout(function (err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    }


    static async settingsPage(req, res) {
        const user = await User.findById(req.user.id)
        res.render('settings', { user })
    }

    static async updateData(req, res) {
        const { name, surname } = req.body
        await User.findByIdAndUpdate(req.user.id, { name, surname })
        res.render('settings');
    }

    static async updateNickname(req, res) {
        const errors = validationResult(req)
        const errorsObj = {}
        if (!errors.isEmpty()) {
            errors.array().forEach(err => {
                errorsObj[err.path + "Err"] = err.msg;
            });
            console.log(errorsObj);
            req.session.error = errorsObj
            res.render('settings', { errorsObj });
        } else {
            delete req.session.error
            await User.findByIdAndUpdate(req.user.id, { nickname: req.body.nickname })
            res.render('settings');
        }
    }

    static async updatePassword(req, res) {
        const errors = validationResult(req);
        const errorsObj = {};

        if (!errors.isEmpty()) {
            errors.array().forEach((err) => {
                errorsObj[err.path + 'Err'] = err.msg;
            });
            req.session.errors = errorsObj;
            return res.render('settings', { errorsObj });
        }

        delete req.session.errors;
        const password = bcrypt.hashSync(req.body.newPassword, 10);
        await User.findByIdAndUpdate(req.user.id, { password });
        res.render('settings');
    }

    static async uploadImage(req, res) {
        if (req.file) {
            await User.findByIdAndUpdate(req.user.id, {
                picUrl: req.file.filename
            });
            res.redirect('/user/settings');
        } else {
            res.redirect('/user/settings');
        }
    }

    static async chatPage(req, res) {
        const friend = await User.findById(req.params.id)
        const users = await User.find({ name: { $ne: req.user.name }, isVerify: true })
        res.render('chat', { users, friend })
    }
}


module.exports = UserController