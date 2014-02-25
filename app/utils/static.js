var isAbsolute = /^(https?:\/\/|\/)/i;

function makeStaticUrlMethod(subdir, extension, aliasesKey) {
    return function (staticConfig, path, type) {
        var aliases = staticConfig.aliases && staticConfig.aliases[aliasesKey];
        var url;
        var alias;

        type = type || 'app';
        alias = aliases && aliases[type] && aliases[type][path];

        if (alias && isAbsolute.test(alias)) {
            return alias;
        } else {
            url = [staticConfig.root];
            url.push(type === 'vendor' ? type : 'app', subdir);
            if (type !== 'app' && type !== 'vendor') {
                url.push(type);
            }
            url.push((alias || path) + extension);

            return url.join('/');
        }
    }
}

module.exports = {

    script: makeStaticUrlMethod('js', '.js', 'scripts'),
    style: makeStaticUrlMethod('css', '.css', 'styles'),
    image: function (staticConfig, path, type) {
        var url = [staticConfig.root];

        type = type || 'app';
        url.push(type === 'vendor' ? type : 'app', 'img');
        if (type !== 'app' && type !== 'vendor') {
            url.push(type);
        }
        url.push(path);

        return url.join('/');
    }

};