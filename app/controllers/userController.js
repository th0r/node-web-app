var passport = require('passport');
var Controller = require('locomotive').Controller;
var User = require('../models/user');
var loggedOut = require('../filters/loggedOut');

var userController = new Controller();

userController.before(['loginForm', 'login', 'registrationForm', 'register'], loggedOut());

userController.loginForm = function () {
    this.scripts = ['app/user/login'];
    this.render('loginForm');
};

userController.registrationForm = function () {
    this.scripts = ['app/user/registration'];
    this.render('registrationForm');
};

userController.login = function () {
    var self = this;
    var req = this.req;
    var body = req.body;

    passport._strategy('local')._verify(body.email || '', body.password || '', function (err, user, info) {
        if (err) {
            return self.next(err);
        }
        if (!user) {
            return self.res.json({
                error: info.message || 'No such user'
            });
        }

        req.login(user, function (err) {
            if (err) {
                return self.next(err);
            }
            return self.res.json({
                redirectTo: self.indexPath()
            });
        });
    });
};

userController.logout = function () {
    this.req.logout();
    this.redirect(this.indexPath());
};

userController.register = function () {
    var self = this;
    var req = this.req;
    var body = req.body;

    User.register({
        email: body.email
    }, body.password, function (err, user) {
        if (err) {
            return self.res.json({
                error: err.message
            });
        }
        req.login(user, function (err) {
            if (err) {
                return self.next(err);
            }

            return self.res.json({
                redirectTo: self.indexPath()
            });
        });
    });
};

module.exports = userController;
