var Q = require('q');
var _ = require('lodash');
var util = require('util');

module.exports = function (done) {
    var User;
    var adminInfo;
    var admin;

    console.log('Loading admin user from "config/admin.json"...');
    try {
        adminInfo = require('../admin.json');
        console.log('Admin user loaded:', adminInfo);
    } catch (e) {
        console.log('There is no admin user provided');
        return done();
    }

    // Trying to create document for admin user
    User = require('../../app/models/User');

    try {
        admin = new User(adminInfo);
    } catch (e) {
        console.error('Error creating document for admin user:', e);
        return done();
    }

    Q(User.find({ roles: 'admin' }, 'email').exec())
        .then(function (admins) {
            if (admins.length) {
                throw util.format(
                    'There are %d admins in the database already. Their emails are: %s',
                    admins.length,
                    _.pluck(admins, 'email').join(', ')
                );
            } else {
                // Searching for user with this email
                return Q(User.findByEmail(admin.email).select('email').exec());
            }
        })
        .then(function (user) {
            if (user) {
                throw util.format(
                    'User with email %s is already registered',
                    admin.email
                );
            } else {
                admin.roles.push('admin');

                return Q.ninvoke(admin, 'setPassword', adminInfo.password);
            }
        })
        .then(function (admin) {
            return Q.ninvoke(admin, 'save');
        })
        .then(function () {
            console.log(
                'Admin with email "%s" has been created successfully',
                admin.email
            );
            done();
        })
        .fail(function (err) {
            console.log('Admin user hasn\'t been created.');
            console.log(err);
            done();
        });

};