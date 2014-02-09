var Vue = require('vue');

var Form = Vue.extend({

    created: function () {
        this.form = {};
        this.submitting = false;
    },

    computed: {
        submittionAllowed: function () {
            return !this.submitting;
        }
    },

    directives: {
        attr: function (value) {
            if (value === false || value === null) {
                this.el.removeAttribute(this.arg)
            } else {
                this.el.setAttribute(this.arg, value)
            }
        }
    },

    methods: {
        submit: function (event) {
            var self = this;
            var form = event.el;

            self.error = null;
            this.submitting = true;
            event.preventDefault();

            $.post(form.action, this.form,
                function (result) {
                    if (result.error) {
                        self.error = result.error;

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
        }
    }
});

module.exports = Form;