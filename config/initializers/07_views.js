var path = require('path');
var nunjucks = require('nunjucks');
var viewsDir = path.resolve(__dirname, '../../app/views');

module.exports = function () {
    var isProd = (this.get('env') === 'production');

    var env = nunjucks.configure(viewsDir, {
        autoescape: true,
        watch: !isProd,
        express: this.express
    });

    env.addFilter('addslashes', function (str) {
        return str.replace(/['"\\]/g, '\\$&');
    });

    env.addExtension('ScriptExtension', require('../../app/template/extensions/script'));

    this.locals({
        config: this.get('config'),
        app: {
            name: this.get('app name')
        }
    });

    // TODO: how to set ".html" as default views
//    this.engine('html', swig.renderFile);
//    this.set('view engine', 'html');
    this.set('views', viewsDir);
    // Disabling "Express" view cache (using "Swig" templates caching)
    this.set('view cache', false);

    // Override default template extension.  By default, Locomotive finds
    // templates using the `name.format.engine` convention, for example
    // `index.html.ejs`  For some template engines, such as Jade, that find
    // layouts using a `layout.engine` notation, this results in mixed conventions
    // that can cause confusion.  If this occurs, you can map an explicit
    // extension to a format.
    this.format('html', { extension: '.html' });

    // Register formats for content negotiation.  Using content negotiation,
    // different formats can be served as needed by different clients.  For
    // example, a browser is sent an HTML response, while an API client is sent a
    // JSON or XML response.
    /* this.format('xml', { engine: 'xmlb' }); */
};