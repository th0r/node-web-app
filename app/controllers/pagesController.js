var ApplicationController = require('./ApplicationController');

var pagesController = new ApplicationController();

pagesController.index = function () {
    this.scripts = [
        ['app', 'pages/index']
    ];
    this.render();
};

module.exports = pagesController;
