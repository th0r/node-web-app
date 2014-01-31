var Controller = require('locomotive').Controller;

var userController = new Controller();

userController.register = function () {
    this.scripts = ['app/user/register'];
    this.render();
};

module.exports = userController;
