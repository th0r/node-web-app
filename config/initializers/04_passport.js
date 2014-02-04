var passport = require('passport');

module.exports = function () {
    var User = require('../../app/models/user');

    passport.use(User.createStrategy());

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
};