var $ = require('jquery');
var Vue = require('vue');
var LoginFormView = require('../../views/LoginFormView');

$(function () {

    App.loginForm = new LoginFormView(App.loginForm);

});