var $ = require('jquery');
var Vue = require('vue');
var RegistrationFormView = require('../../views/RegistrationFormView');

$(function () {

    App.registrationForm = new RegistrationFormView(App.registrationForm);

});