module.exports = function (env) {

    ['script'].forEach(function (extension) {
        var info = require('./extensions/' + extension);
        env.addExtension(info.name, info.extension);
    });

};