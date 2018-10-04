module.exports = {
    ensureAuthenticated: function (req, res ,next) {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Not autherized')
        res.redirect('/users/login');
    }
};