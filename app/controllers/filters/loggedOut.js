var _ = require('lodash');

module.exports = function (redirectTo) {
    return function (next) {
        if (this.req.isAuthenticated()) {
            this.redirect(redirectTo ? redirectTo.call(this) : this.indexPath());
        } else {
            next();
        }
    }
};