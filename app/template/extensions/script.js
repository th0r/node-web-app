var extend = require('../../utils/extend');

function ScriptExtension(config) {
    config = this.config = config || {};
    config.aliases = config.aliases || {};
}

extend(ScriptExtension, {

    tags: ['script'],

    parse: function (parser, nodes, lexer) {
        var start = parser.nextToken();
        var line = start.lineno;
        var col = start.colno;
        var tagName = start.value;
        var scriptType = null;
        var scriptPath = null;
        var args;
        var tok;

        // Taking optional type of script
        tok = parser.nextToken();
        if (tok && tok.type === lexer.TOKEN_SYMBOL) {
            // Got explicit script type
            scriptType = tok.value;
            tok = parser.nextToken();
        }

        // Taking script path
        if (tok && tok.type === lexer.TOKEN_STRING) {
            scriptPath = tok.value;
        } else {
            parser.fail(tagName + ' tag: unexpected token "' + tok.value + '"',
                tok.lineno, tok.colno);
        }

        parser.advanceAfterBlockEnd(tagName);

        args = new nodes.NodeList(line, col, [
            new nodes.Literal(line, col, scriptType || ''),
            new nodes.Literal(line, col, scriptPath)
        ]);

        return new nodes.NodeList(line, col, [
            new nodes.Output(line, col, [new nodes.TemplateData(line, col, '<script src="')]),
            new nodes.CallExtension(this, 'generateUrl', args),
            new nodes.Output(line, col, [new nodes.TemplateData(line, col, '"></script>')])
        ]);
    },

    generateUrl: function (context, type, path) {
        var staticConfig = context.ctx.config.static;
        var aliases = staticConfig.aliases || {};
        var url = [staticConfig.root || '/static'];
        var scriptName;
        var isRootType;

        type = type || 'app';
        isRootType = (type === 'app' || type === 'vendor');
        url.push(type === 'vendor' ? type : 'app', 'js');

        if (!isRootType) {
            url.push(type);
        }

        scriptName = (aliases[type] && aliases[type][path]) || path;
        url.push(scriptName + '.js');

        return url.join('/');
    }

});

module.exports = new ScriptExtension();