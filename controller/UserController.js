const { User } = require("../model/model");

class UserController {
    constructor() { throw new Error("UserController is abstract class, cannot create an object from it") }

    static async homePage(req, res) {
        const user = req.user;
        const users = await User.find()
        res.render('homePage', { user,users }); 
    }
    static async logOut(req,res){
        req.logout()
        res.redirect('/')
    }
}

module.exports = UserController