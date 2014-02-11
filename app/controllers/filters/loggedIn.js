module.exports = function (redirectTo) {
    return function (next) {
        if (this.req.isAuthenticated()) {
            next();
        } else {
            this.redirect(redirectTo ? redirectTo.call(this) : this.loginPath());
        }
    }
};