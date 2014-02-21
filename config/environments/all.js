var pkg = require('../../package.json');
var staticConfig;

try {
    staticConfig = require('../static');
} catch (e) {
    staticConfig = {
        root: '/static'
    };
}

module.exports = function () {

    this.set('app name', pkg.name);
    this.set('static', staticConfig);

};