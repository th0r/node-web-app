var Form = require('./Form');

var LoginForm = Form.extend({

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

LoginForm.componentName = 'login-form';

module.exports = LoginForm;