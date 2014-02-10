var mongoose = require('mongoose');
var String = mongoose.Schema.Types.String;

function validateEmail(val) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(val);
}

function Email(path, options) {
    String.call(this, path, options);
    this.validate(validateEmail, options.validationError || 'Email is invalid');
}

Email.prototype.__proto__ = String.prototype;

Email.validate = validateEmail;

Email.prototype.cast = function (val) {
    val = String.prototype.cast.apply(this, arguments);

    return val.toLowerCase();
};

module.exports = Email;