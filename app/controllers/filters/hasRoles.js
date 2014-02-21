module.exports = function (roles) {
    return function (next) {
        var user = this.req.user;

        if (user && user.hasRoles(roles)) {
            next();
        } else {
            this.res.statusCode = 403;
            this.render('errors/403.html');
        }
    }
};