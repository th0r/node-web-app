var Vue = require('vue');

module.exports = function (components) {
    components.forEach(function (component) {
        Vue.component(component.name, component);
    });

    return components;
};