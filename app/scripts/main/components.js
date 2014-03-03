var componentsRegistrator = require('../utils/componentsRegistrator');

module.exports = componentsRegistrator([
    require('../components/LoginForm'),
    require('../components/RegistrationForm')
]);