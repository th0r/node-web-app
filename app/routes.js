module.exports = function (app) {

    app.get('/', require('./controllers/index.js'));
    app.get('/registration', require('./controllers/registration.js'));

    // Add 404 handler
    app.use(require('./controllers/404.js'));

};