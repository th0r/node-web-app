module.exports = function () {

    var express = require('express');
    var MongoStore = require('connect-mongo')(express);
    var dbConfig = this.get('db');

    // Using Mongo-based session storage
    this.set('session store', new MongoStore({
        host: dbConfig.host,
        port: dbConfig.port,
        db: dbConfig.db,
        username: dbConfig.username,
        password: dbConfig.password,
        collection: dbConfig.sessionsCollection
    }));

};