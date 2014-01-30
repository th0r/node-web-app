var pkg = require('./package.json');
var secrets = require('./configs/secrets.json');
var path = require('path');
var express = require('express');
var swig = require('swig');
var stylus = require('stylus');
var passport = require('passport');
var app = express();
var env = app.get('env');
var isProd = (env === 'production');
var port = process.env.PORT || (isProd ? 80 : 3000);

// ==================================== Template engine ====================================
swig.setDefaults({
    loader: swig.loaders.fs(__dirname + '/app/templates'),
    locals: {
        SCRIPTS_PATH: '/static/js',
        STYLES_PATH: '/static/css',
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

// GZip compression. Better to do with "nginx" or something else.
if (isProd) {
    app.use(express.compress());
}

app.use('/static', express.static(__dirname + '/public'));
app.use(express.cookieParser());
// "connect.urlencoded()" + "connect.json()" replaces "bodyParser" 
app.use(express.urlencoded());
app.use(express.json());
app.use(express.session({
    secret: secrets.sessionKey,
    key: 'sid',
    cookie: {
        path: '/',
        httpOnly: true,
        // One year cookie
        maxAge: 365 * 24 * 60 * 60 * 1000
    }
}));
app.use(passport.initialize());
app.use(passport.session());

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