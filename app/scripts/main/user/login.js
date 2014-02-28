var $ = require('jquery');
var Vue = require('vue');
var LoginForm = require('../../components/LoginForm');

$(function () {

    App.loginForm = new LoginFormView(App.loginForm);

});