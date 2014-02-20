var AdminController = require('./AdminController');
var extend = require('../../utils/extend');
var _ = require('lodash');

var AdminPagesController = function () {
    AdminController.call(this);
};

extend(AdminPagesController, AdminController, {

    index: function () {
        this.redirect(this.adminUsersPath());
    }

});

module.exports = AdminPagesController;