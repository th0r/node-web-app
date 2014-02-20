var Controller = require('locomotive').Controller;
var exposeUser = require('./filters/exposeUser')();
var extend = require('../utils/extend');
var _ = require('lodash');
var ValidationError = require('mongoose').Error.ValidationError;

var ApplicationController = function () {
    Controller.call(this);
    this.before('*', exposeUser);
};

extend(ApplicationController, Controller, {

    jsonError: function (err) {
        var error = {};

        if (err instanceof ValidationError) {
            error.type = 'validation';
            // Details contain form fields errors
            error.details = _.mapValues(err.errors, function (fieldError) {
                return fieldError.message;
            });
        } else if (typeof err === 'string') {
            error.message = err;
        } else {
            error.message = err.message || 'Неизвестная ошибка';
        }

        this.res.json({
            error: error
        });
    }

});

module.exports = ApplicationController;
