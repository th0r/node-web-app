var express = require('express');
var MongoStore = require('connect-mongo')(express);

module.exports = function (done) {
    // Using Mongo-based session storage
    this.set('session store', new MongoStore({
        mongoose_connection: this.get('mongo connection'),
        collection: this.get('db').sessionsCollection
    }, function () {
        done();
    }));
};