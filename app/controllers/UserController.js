var passport = require('passport');
var extend = require('../utils/extend');
var ApplicationController = require('./ApplicationController');
var User = require('../models/User');
var loggedOut = require('./filters/loggedOut')();

var UserController = function () {
    ApplicationController.call(this);
    this.before(['loginPage', 'login', 'registrationPage', 'register'], loggedOut);
};

extend(UserController, ApplicationController, {

    loginPage: function () {
        this.scripts = [
            ['app', 'user/login']
        ];
        this.render('loginPage');
    },

    registrationPage: function () {
        this.scripts = [
            ['app', 'user/registration']
        ];
        this.render('registrationPage');
    },

    login: function () {
        var self = this;
        var req = this.req;
        var body = req.body;

        passport._strategy('local')._verify(body.email || '', body.password || '', function (err, user, info) {
            if (err) {
                return self.next(err);
            }
            if (!user) {
                return self.jsonError(info);
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
    },

    logout: function () {
        this.req.logout();
        this.redirect(this.indexPath());
    },

    register: function () {
        var self = this;
        var req = this.req;
        var body = req.body;

        User.register(body.email, body.password, function (err, user) {
            if (err) {
                return self.jsonError(err);
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
    }

});

module.exports = UserController;
