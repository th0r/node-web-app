var Controller = require('locomotive').Controller;
var util = require('util');
var _ = require('lodash');
var ValidationError = require('mongoose').Error.ValidationError;

var ApplicationController = function () {
    Controller.call(this);
};

util.inherits(ApplicationController, Controller);

ApplicationController.prototype.jsonError = function (err) {
    var error = {};

    if (err instanceof ValidationError) {
        error.type ='validation';
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
};

module.exports = ApplicationController;
