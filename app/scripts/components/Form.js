var _ = require('lodash');
var $ = require('jquery');
var Vue = require('vue');

var Form = Vue.extend({

    created: function () {
        this.fields = {};
        this.successMessage = null;
        this.formError = null;
        this.fieldErrors = {};
        this.submitting = false;
    },

    ready: function () {
        this.hideSuccessMessageTimeout = 2;
    },

    computed: {

        submittionAllowed: function () {
            return !this.submitting;
        },

        valid: function () {
            return !this._hasValidationErrors(this.validationErrors);
        },

        validationErrors: function () {
            return false;
        }

    },

    methods: {

        submit: function (event) {
            event.preventDefault();

            if (!this.submittionAllowed) {
                return;
            }

            var validationErrors = this.validationErrors;

            this.formError = null;
            if (this._hasValidationErrors(validationErrors)) {
                this.fieldErrors = validationErrors;
                return;
            }
            this.fieldErrors = {};

            this._sendRequest({
                data: this.fields
            });
        },

        validate: function () {
            this.fieldErrors = this.validationErrors || {};
        },

        remove: function (event) {
            event.preventDefault();

            if (!this.submittionAllowed) {
                return;
            }

            this.formError = null;
            this.fieldErrors = {};

            this._sendRequest({
                method: 'delete'
            });
        },

        showSuccessMessage: function (message) {
            var self = this;
            var hideTimeout = this.hideSuccessMessageTimeout;

            this.hideSuccessMessage();
            this.successMessage = message;
            if (hideTimeout) {
                this._hideSuccessMessageTimer = setTimeout(function () {
                    self.hideSuccessMessage();
                }, hideTimeout * 1000);
            }
        },

        hideSuccessMessage: function () {
            this.successMessage = '';
            clearTimeout(this._hideSuccessMessageTimer);
        },

        _hasValidationErrors: function (errors) {
            return !!errors && !$.isEmptyObject(errors);
        },

        _getSuccessMessage: function (responseResult) {
            return responseResult.message;
        },

        _sendRequest: function (ajaxOpts) {
            var self = this;
            var form = this.$el;

            ajaxOpts = _.clone(ajaxOpts);

            ajaxOpts.url = ajaxOpts.url || form.action;
            ajaxOpts.method = ajaxOpts.method || (form._method ? form._method.value : form.method);
            ajaxOpts.type = 'json';

            this.submitting = true;

            return $.ajax(ajaxOpts)
                .done(function (result) {
                    var successMessage;
                    var error = result.error;

                    if (error) {
                        self.formError = error.message;
                        self.fieldErrors = error.details || {};

                        return;
                    }

                    successMessage = self._getSuccessMessage(result);
                    if (successMessage) {
                        self.showSuccessMessage(successMessage);
                    }

                    if (result.redirectTo) {
                        location.href = result.redirectTo;
                    }
                })
                .fail(function () {
                    self.formError = 'Ошибка отправки запроса. Попробуйте еще раз.';
                })
                .always(function () {
                    self.submitting = false;
                });
        }

    }
});

Form.componentName = 'form';

module.exports = Form;