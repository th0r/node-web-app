var passport = require('passport');

module.exports = function () {
    var User = require('../../app/models/User');

    passport.use(User.createLocalStrategy());

    passport.serializeUser(User.serialize.bind(User));
    passport.deserializeUser(User.deserialize.bind(User));
};