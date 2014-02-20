var _ = require('lodash');
var _s = require('underscore.string');
var path = require('path');
var existsSync = require('fs').existsSync;

/**
 * Fast controller resolver.
 * Transforms "user" controller to script "UserController.js".
 * Transforms "admin/user" controller to script "admin/UserController.js".
 *
 * @param dirname
 * @returns {Function}
 */
module.exports = function (dirname) {
    var dir;

    dirname = dirname || 'app/controllers';
    dir = path.resolve(dirname);

    return function (id) {
        var parts = id.split('/');
        var scriptName = _s.capitalize(parts.pop()) + 'Controller.js';
        var scriptPath = path.join(dir, parts.join('/'), scriptName);

        return existsSync(scriptPath) ? scriptPath : false;
    };
};