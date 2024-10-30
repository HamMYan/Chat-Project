const express = require('express');
const user = express.Router();
const UserController = require('../controller/UserController');
const { body } = require('express-validator');
const { User } = require('../model/model');
const bcrypt = require('bcrypt');
const { upload } = require('../uploads/config');
const SocketController = require('../controller/SocketController');
const socketController = new SocketController()

user.get('/homePage', UserController.homePage);
user.get('/logOut', UserController.logOut);
user.get('/settings', UserController.settingsPage);
user.get('/chat/:id', UserController.chatPage)

user.post('/updateData', UserController.updateData);

user.post('/updateNickname', [
    body('nickname').custom(async (value) => {
        if (value) {
            const user = await User.findOne({ nickname: value });
            if (user) throw new  Error(`${value} - has already`);
            return true;
        }
        return true;
    })
], UserController.updateNickname);

user.post('/updatePassword', [
    body('oldPassword').trim().notEmpty().withMessage('Old Password is required')
        .custom(async (value, { req }) => {
            const user = await User.findById(req.user.id);
            if (!user || !await bcrypt.compare(value, user.password)) {
                throw new Error('Old Password is incorrect');
            }
            return true;
        }),
    body('newPassword').trim().notEmpty().withMessage('New Password is required')
        .isLength({ min: 6 }).withMessage('Password minimum length is 6')
        .custom((value, { req }) => {
            if (req.body.oldPassword === value) {
                throw new Error('New Password should not be the same as Old Password');
            }
            return true;
        }),
    body('confpass').trim().notEmpty().withMessage('Confirm Password is required')
        .custom((value, { req }) => {
            if (req.body.newPassword !== value) {
                throw new Error('Confirm Password does not match New Password');
            }
            return true;
        }),
], UserController.updatePassword);


user.post('/uploadImage', upload.single('image'), UserController.uploadImage);
user.post('/newMess/:id', async (req, res) => {
    const { message } = req.body
    await socketController.newMess(req, res, message);
});

module.exports = user;
