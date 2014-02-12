var pkg = require('../../package.json');

module.exports = function () {

    this.set('app name', pkg.name);
    this.set('static root', '/static');

};