var Vue = require('vue');

module.exports = function (components) {
    components.forEach(function (component) {
        Vue.component(component.componentName, component);
    });

    return components;
};