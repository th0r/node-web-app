var ApplicationController = require('../ApplicationController');
var hasRoles = require('../filters/hasRoles');

var adminPagesController = new ApplicationController();

adminPagesController.before('*', hasRoles('admin'));

adminPagesController.index = function () {
    this.styles = [
        ['vendor', 'bootstrap']
    ];
    this.scripts = [
        ['vendor', 'bootstrap']
    ];
    this.render('admin/index');
};

module.exports = adminPagesController;