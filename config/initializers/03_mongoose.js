var mongoose = require('mongoose');
var mongooseTypes = require('mongoose-types');

module.exports = function (done) {
    var self = this;
    var db = this.get('db');

    this.datastore(require('locomotive-mongoose'));

    // Add "Email" and "Url" mongoose types
    mongooseTypes.loadTypes(mongoose);

    // Connect to the DB
    mongoose.connect(db.host, db.database, db.port, {
        user: db.username,
        pass: db.password,
        server: {
            socketOptions: {
                keepAlive: 1
            }
        },
        db: {
            native_parser: true
        }
    }, function (err) {
        if (err) {
            console.log('Error connecting to MongoDB:', err);
        } else {
            self.set('mongo connection', mongoose.connection);
        }
        done(err);
    });
};