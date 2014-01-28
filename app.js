var path = require('path');
var express = require('express');
var swig = require('swig');
var pkg = require('./package.json');
var app = express();
var env = process.env.NODE_ENV;
var dev = (env === 'development');
var port = process.env.PORT || (dev ? 3000 : 80);
var util = require('util');

// ==================================== Template engine ====================================
swig.setDefaults({
    loader: swig.loaders.fs(__dirname + '/app/templates'),
    locals: {
        SCRIPTS_PATH: '/js',
        STYLES_PATH: '/css',
        app: {
            name: pkg.name
        }
    },
    cache: dev ? null : 'memory'
});

/*var tmplFile = __dirname + '/app/templates/index.html';
var src = require('fs').readFileSync(tmplFile, 'utf8');
var tmplSrc = swig.precompile(src, {filename: tmplFile}).tpl.toString();

console.log(tmplSrc);*/
//console.log(util.inspect(tmpl, {depth: null}));

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/app/templates');
// Disabling "Express" view cache (using "Swig" templates caching)
app.set('view cache', false);

// ==================================== Middlewares ====================================
app.use(express.logger());
app.use(express.compress());
app.use(express.static(__dirname + '/public'));

// Add routes
require('./app/routes.js')(app);

app
    .listen(port, function () {
        console.log('Server is working on port', port, '...');
    })
    .on('error', function (err) {
        console.error('Server error occured: ', err);
    })
    .on('close', function () {
        console.log('Server has been shut down');
    });