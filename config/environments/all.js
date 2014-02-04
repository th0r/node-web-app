var pkg = require('../../package.json');

module.exports = function () {

    this.set('app name', pkg.name);
    this.set('js root', '/static/js');
    this.set('css root', '/static/css');

};