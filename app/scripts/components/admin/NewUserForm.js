var $ = require('jquery');
var Form = require('../Form');
var CustomEvent = require('../../utils/CustomEvent');

var NewUserForm = Form.extend({

    ready: function () {
        // BUGFIX: ready вызывается 2 раза
        if (!this._rolesEl) {
            var changeEvent = new CustomEvent('change');

            this._rolesEl = $(this.$el)
                .find('[name=roles]')
                .select2()
                .on('change', function (e) {
                    if (!e.originalEvent) {
                        // BUGFIX: чтобы обновилась модель, нужно вызвать нативное браузерное событие
                        // https://github.com/yyx990803/vue/issues/96#issuecomment-37870300
                        this.dispatchEvent(changeEvent);
                    }
                });
        }
    },

    beforeDestroy: function () {
        this._rolesEl.select2('destroy');
        this._rolesEl = null;
    },

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

            if (!fields.password) {
                errors.password = 'Введите пароль';
            }

            return errors;
        }

    }

});

NewUserForm.componentName = 'new-user-form';

module.exports = NewUserForm;