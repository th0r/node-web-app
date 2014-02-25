var getScriptUrl = require('../../utils/static').script;

module.exports = {

    ends: false,
    blockLevel: true,

    parse: function (str, line, parser, types, stack, options) {
        parser.on(types.STRING, function (token) {
            var args = this.out;

            token = token.match;

            if (args.length < 2) {
                args.push(token);
            } else {
                throw Error('Unexpected token "' + token + '" on line ' + line);
            }
        });

        parser.on('*', function (token) {
            if (token.type !== types.WHITESPACE) {
                throw Error('Unexpected token "' + token.match + '" on line ' + line);
            }
        });

        return true;
    },

    compile: function (compiler, args, content, parents, options, blockName) {
        return '_output += "<script src=\\"" + _filters.e(_ext.script(_ctx.config.static, ' + args.reverse().join(', ') + ')) + "\\"></script>";\n';
    },

    extensions: {
        script: getScriptUrl
    }

};