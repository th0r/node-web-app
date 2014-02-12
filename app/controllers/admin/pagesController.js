var ApplicationController = require('../ApplicationController');
var hasRoles = require('../filters/hasRoles');

var adminPagesController = new ApplicationController();

adminPagesController.before('*', hasRoles('admin'));

adminPagesController.index = function () {
    this.render('admin/index');
};

module.exports = adminPagesController;