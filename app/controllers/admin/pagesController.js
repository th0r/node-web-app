var AdminController = require('./AdminController');
var _ = require('lodash');

var adminPagesController = new AdminController();

_.extend(adminPagesController, {

    index: function () {
        this.redirect(this.adminUsersPath());
    }

});

module.exports = adminPagesController;