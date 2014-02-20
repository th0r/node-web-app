var $ = require('jquery');
var Vue = require('vue');

var Form = Vue.extend({

    created: function () {
        this.fields = {};
        this.formError = null;
        this.fieldErrors = {};
        this.submitting = false;
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
            var form = event.el;
            var validationErrors = this.validationErrors;

            if (this._hasValidationErrors(validationErrors)) {
                this.fieldErrors = validationErrors;
                return;
            }

            self.formError = null;
            self.fieldErrors = {};

            this.submitting = true;
            $.post(form.action, this.fields,
                function (result) {
                    var error = result.error;

                    if (error) {
                        self.formError = error.message;
                        self.fieldErrors = error.details || {};

                        return;
                    }

                    if (result.redirectTo) {
                        location.href = result.redirectTo;
                    }
                },
                'json')
                .always(function () {
                    self.submitting = false;
                });
        },

        _hasValidationErrors: function (errors) {
            return !!errors && !$.isEmptyObject(errors);
        }

    }
});

module.exports = Form;