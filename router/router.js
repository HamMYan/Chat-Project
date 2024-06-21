const router = require("express").Router();
const bcrypt = require('bcrypt');
const { body, validationResult } = require("express-validator");
const Maincontroller = require('../controller/MainController');
const { User } = require("../model/model");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

router.get('/', Maincontroller.loginPage);
router.get('/register', Maincontroller.registerPage);
router.get('/verify', Maincontroller.verify);
router.get('/verifypage', Maincontroller.verifyPage);

router.post('/register', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('surname').trim().notEmpty().withMessage('Surname is required'),
    body('nickname').trim().notEmpty().withMessage('Nickname is required')
        .isLength({ min: 6 }).withMessage('Nickname minimum length is 6')
        .custom(async (value) => {
            const user = await User.findOne({ nickname: value });
            if (user) throw new Error(`${value} - has already been taken`);
            return true;
        }),
    body('phonenumber').trim().notEmpty().withMessage('Phone number is required')
        .custom(async (value) => {
            const user = await User.findOne({ phonenumber: value });
            if (user) throw new Error(`${value} - has already been taken`);
            return true;
        }),
    body('email').trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) throw new Error(`${value} - has already been taken`);
            return true;
        }),
    body('password').trim().notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password minimum length is 6'),
    body('confpass').trim().notEmpty().withMessage('Confirm Password is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) throw new Error('Passwords do not match');
            return true;
        })
], Maincontroller.register);

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

const loginValidation = [
    body('email').trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user && (!user.isVerify || user.emailToken)) throw new Error('User is not verified');
            if (!user) throw new Error('Incorrect email');
            return true;
        }),
    body('password').trim().notEmpty().withMessage('Password is required')
        .custom(async (value, { req }) => {
            if(!value) throw new Error('Password is required')
            const user = await User.findOne({ email: req.body.email });
            if (!user) throw new Error('User not found');
            const isMatch = await bcrypt.compare(value, user.password);
            if (!isMatch) throw new Error('Incorrect password');
            return true;
        })
];

router.post('/login',
    loginValidation,
    Maincontroller.loginValidation,
    passport.authenticate('local', {
        successRedirect: '/user/profile',
        failureRedirect: '/',
    })
);

module.exports = router;
