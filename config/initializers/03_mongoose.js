var mongoose = require('mongoose');

module.exports = function (done) {
    var self = this;
    var db = this.get('db');

    this.datastore(require('locomotive-mongoose'));

    mongoose.connect(db.host, db.database, db.port, {
        user: db.username,
        pass: db.password
    }, function (err) {
        if (err) {
            console.log('Error connecting to MongoDB:', err);
        } else {
            self.set('mongo connection', mongoose.connection);
        }
        done(err);
    });
};