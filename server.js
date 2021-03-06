var locomotive = require('locomotive');
var bootable = require('bootable');
var app = new locomotive.Application();
var port = process.env.PORT || (process.env.NODE_ENV === 'production' ? 80 : 3000);

// Create a new application and initialize it with *required* support for
// controllers and views.  Move (or remove) these lines at your own peril.
app.phase(function () {
    // Use custom view and controller resolvers
    this.controllers.resolve.use(require('./app/resolvers/controller')(__dirname + '/app/controllers'));
    this.views.resolve.use(require('./app/resolvers/view'));
    // Use custom controller instantiator
    this.controllers.instantiate.use(require('./app/instantiators/controller'));
});

// Add phases to configure environments, run initializers, draw routes, and
// start an HTTP server.  Additional phases can be inserted as neeeded, which
// is particularly useful if your application handles upgrades from HTTP to
// other protocols such as WebSocket.
app.phase(require('bootable-environment')(__dirname + '/config/environments'));
app.phase(bootable.initializers(__dirname + '/config/initializers'));
app.phase(locomotive.boot.routes(__dirname + '/config/routes'));
app.phase(locomotive.boot.httpServer(port, '0.0.0.0'));

// Boot the application.  The phases registered above will be executed
// sequentially, resulting in a fully initialized server that is listening
// for requests.
app.boot(function (err) {
    if (err) {
        console.error(err.message);
        console.error(err.stack);

        return process.exit(-1);
    }
});
