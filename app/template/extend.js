module.exports = function (swig) {

    ['script', 'style', 'img'].forEach(function (moduleName) {
        var tag = require('./tags/' + moduleName);

        swig.setTag(tag.name || moduleName, tag.parse, tag.compile, tag.ends, tag.blockLevel);
        if (tag.extensions) {
            for (var extName in tag.extensions) {
                swig.setExtension(extName, tag.extensions[extName]);
            }
        }
    });

};