var $ = require('jquery');
var Vue = require('vue');
var RegistrationForm = require('../../components/RegistrationForm');

$(function () {

    App.registrationForm = new RegistrationForm(App.registrationForm);

});