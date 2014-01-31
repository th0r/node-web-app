var Controller = require('locomotive').Controller;

var pagesController = new Controller();

pagesController.index = function () {
    this.scripts = ['app/pages/index'];
    this.render();
};

module.exports = pagesController;
