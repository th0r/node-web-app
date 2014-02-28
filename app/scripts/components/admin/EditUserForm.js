var Form = require('../Form');

var EditUserForm = Form.extend({

    computed: {

        submittionAllowed: function () {
            return !this.submitting && this.valid;
        },

        validationErrors: function () {
            var fields = this.fields;
            var errors = {};

            if (!fields.email) {
                errors.email = 'Введите email';
            }

            return errors;
        }

    }

});

EditUserForm.componentName = 'edit-user-form';

module.exports = EditUserForm;