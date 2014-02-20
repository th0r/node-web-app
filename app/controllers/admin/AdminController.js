var ApplicationController = require('../ApplicationController');
var isAdmin = require('../filters/hasRoles')('admin');
var extend = require('../../utils/extend');

var AdminController = function () {
    ApplicationController.call(this);
    this.before('*', isAdmin);
};

extend(AdminController, ApplicationController);

module.exports = AdminController;
