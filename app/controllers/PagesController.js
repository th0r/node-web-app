var ApplicationController = require('./ApplicationController');
var extend = require('../utils/extend');

function PagesController() {
    ApplicationController.call(this);
}

extend(PagesController, ApplicationController, {

    indexPage: function () {
        this.render('indexPage');
    }

});

module.exports = PagesController;
