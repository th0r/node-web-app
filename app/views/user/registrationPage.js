var $ = require('jquery');
var Vue = require('vue');
var RegistrationFormView = require('../forms/RegistrationFormView');

$(function () {

    App.registrationForm = new RegistrationFormView(App.registrationForm);

});