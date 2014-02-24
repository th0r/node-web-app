var pkg = require('../../package.json');
var config = {};
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
    
    // App config
    config.static = staticConfig;
    this.set('config', config);

};