var passport = require('passport');

module.exports = function () {
    var User = require('../../app/models/user');

    passport.use(User.createLocalStrategy());

    passport.serializeUser(User.serialize.bind(User));
    passport.deserializeUser(User.deserialize.bind(User));
};