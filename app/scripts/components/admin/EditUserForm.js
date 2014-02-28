var Form = require('../Form');

var EditUserForm = Form.extend({

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

EditUserForm.name = 'edit-user-form';

module.exports = EditUserForm;