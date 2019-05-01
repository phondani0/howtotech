module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (!req.isAuthenticated()) {
            console.log('Error: Not Authorized!');
            return res.redirect('/admin/login');
        }
        next();
    }
}