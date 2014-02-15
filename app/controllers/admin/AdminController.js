var ApplicationController = require('../ApplicationController');
var isAdmin = require('../filters/hasRoles')('admin');
var util = require('util');

var AdminControler = function () {
    ApplicationController.call(this);
    this.before('*', isAdmin);
};

util.inherits(AdminControler, ApplicationController);

module.exports = AdminControler;
