var Form = require('./Form');

var RegistrationForm = Form.extend({

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

RegistrationForm.componentName = 'registration-form';

module.exports = RegistrationForm;