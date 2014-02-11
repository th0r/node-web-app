var $ = require('jquery');
var Vue = require('vue');
var LoginFormView = require('../forms/LoginFormView');

$(function () {

    App.loginForm = new LoginFormView(App.loginForm);

});