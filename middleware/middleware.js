module.exports.isNotLogin = (req, res, next) => {
    return req.isAuthenticated() ? next() : res.redirect('/')
}
module.exports.isLogin = (req, res, next) => {
    return req.isAuthenticated() ? res.redirect('/user/homePage') : next()
}