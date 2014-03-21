var ApplicationController = require('../ApplicationController');
var isAdmin = require('../filters/hasRoles')('admin');
var extend = require('../../utils/extend');

function AdminController() {
    ApplicationController.call(this);
    this.before('*', isAdmin);
}

extend(AdminController, ApplicationController, {

    index: function () {
        this.redirect(this.adminUsersPath());
    }

});

module.exports = AdminController;
