var _ = require('lodash');

module.exports = function () {
    var db;

    try {
        console.log('Loading DB configuration from "config/db.json" file...');
        db = require('../db.json');
    } catch(e) {
        console.log('Error loading DB configuration. Using defaults.');
        db = {};
    }

    db = _.extend({
        host: '127.0.0.1',
        port: 27017,
        database: this.get('app name'),
        sessionsCollection: 'sessions',
        username: null,
        password: null
    }, db);

    console.log(db);

    this.set('db', db);
};