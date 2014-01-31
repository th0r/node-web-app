var pkg = require('../../package.json');
var secrets;

try {
    secrets = require('../secrets.json');
} catch (e) {
    secrets = require('../secrets-generator')();
}

module.exports = function () {

    this.set('app name', pkg.name);
    this.set('js root', '/static/js');
    this.set('css root', '/static/css');
    this.set('secrets', secrets);

};
