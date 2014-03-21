var AdminController = require('./AdminController');
var extend = require('../../utils/extend');
var Q = require('q');

function SpaController() {
    AdminController.call(this);
    this.before('*', this._spaMiddleware);
}

extend(SpaController, AdminController, {

    serveApp: function (actionResult) {
        var self = this;

        actionResult.then(
            function (data) {
                self.render('admin/app', {
                    data: data
                });
            },
            function (err) {
                // TODO: делать что-то при ошибке
                // выводить в data?
                // рендерить html с ошибкой?
                self.render('admin/app', {
                    data: {
                        error: err
                    }
                });
            }
        );
    },

    returnData: function (actionResult) {
        var self = this;

        actionResult.then(
            function (data) {
                self.res.json({
                    result: data
                });
            },
            function (err) {
                self.jsonError(err);
            }
        );
    },

    _spaMiddleware: function () {
        var req = this.req;
        var actionResult = Q.invoke(this, this.__action);

        if (req.method === 'GET' && !req.xhr) {
            // Serving static app page with inline data
            this.serveApp(actionResult);
        } else {
            // Returning data with json response
            this.returnData(actionResult);
        }
    }

});

module.exports = SpaController;
