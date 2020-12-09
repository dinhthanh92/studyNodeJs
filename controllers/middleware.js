
module.exports.aulogin = function (req, res, next) {
    if (!req.cookies.userID) {
        res.redirect("/login")
        return;
    } next();
        
}

