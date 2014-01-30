var pkg = require('./package.json');
var path = require('path');
var express = require('express');
var swig = require('swig');
var stylus = require('stylus');
var app = express();
var env = process.env.NODE_ENV;
var isProd = (env === 'production');
var port = process.env.PORT || (isProd ? 80 : 3000);
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
    cache: isProd ? 'memory' : null
});

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/app/templates');
// Disabling "Express" view cache (using "Swig" templates caching)
app.set('view cache', false);

// ==================================== Middlewares ====================================
app.use(express.logger());
app.use(express.compress());

// ==================================== Static serving ====================================
app.use(express.static(__dirname + '/public'));

// ==================================== Router ====================================
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