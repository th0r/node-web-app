var FormView = require('./FormView');

var RegistrationFormView = FormView.extend({

    computed: {

        validationErrors: function () {
            var fields = this.fields;
            var errors = {};

            if (!fields.email) {
                errors.email = 'Введите email';
            }

            if (!fields.password) {
                errors.password = 'Введите пароль';
            }

            return errors;
        }

    }

});

module.exports = RegistrationFormView;