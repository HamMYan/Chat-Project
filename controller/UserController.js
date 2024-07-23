class UserController {
    constructor() { throw new Error("UserController is abstract class, cannot create an object from it") }

    static async homePage(req, res) {
        const user = req.user;
        res.render('homePage', { user }); 
    }
    static async logOut(req,res){
        req.logout()
        res.redirect('/')
    }
}

module.exports = UserController