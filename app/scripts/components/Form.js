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

            var self = this;
            var form = event.target;
            var validationErrors = this.validationErrors;

            self.formError = null;
            if (this._hasValidationErrors(validationErrors)) {
                this.fieldErrors = validationErrors;
                return;
            }
            self.fieldErrors = {};

            this.submitting = true;
            $.ajax(
                {
                    url: form.action,
                    method: form._method ? form._method.value : form.method,
                    data: this.fields,
                    dataType: 'json'
                })
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
                    self.formError = 'Ошибка отправки формы. Попробуйте еще раз.';
                })
                .always(function () {
                    self.submitting = false;
                });
        },

        validate: function () {
            this.fieldErrors = this.validationErrors || {};
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
        }

    }
});

Form.componentName = 'form';

module.exports = Form;