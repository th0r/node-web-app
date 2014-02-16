var ApplicationController = require('./ApplicationController');

var pagesController = new ApplicationController();

pagesController.index = function () {
    this.render();
};

module.exports = pagesController;
