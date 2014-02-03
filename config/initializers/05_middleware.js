var path = require('path');
var express = require('express');
var passport = require('passport');
var publicDir = path.resolve(__dirname, '../../public');

module.exports = function () {
    var isProd = (this.get('env') === 'production');

    this.use(express.favicon(publicDir + '/favicon.ico'));

    if (isProd) {
        // GZip compression. Better to do with "nginx" or something else.
        this.use(express.compress());
    } else {
        this.use(express.logger());
    }

    this.use('/static', express.static(publicDir));
    this.use(express.cookieParser());
    // "connect.urlencoded()" + "connect.json()" replaces "bodyParser"
    this.use(express.urlencoded());
    this.use(express.json());
    this.use(express.session({
        secret: this.get('secrets').sessionKey,
        key: 'sid',
        cookie: {
            path: '/',
            httpOnly: true,
            // One year cookie
            maxAge: 365 * 24 * 60 * 60 * 1000
        },
        store: this.get('session store')
    }));
    this.use(passport.initialize());
    this.use(passport.session());
    this.use(this.router);
    // 404 handler
    this.use(require('../../app/controllers/404'));
    this.use(express.errorHandler());
};
