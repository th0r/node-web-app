var _ = require('lodash');

module.exports = function () {

    var dbConfig;

    try {
        console.log('Loading DB configuration from "config/db.json" file...');
        dbConfig = require('../db.json');
    } catch(e) {
        console.log('Error loading DB configuration. Using defaults.');
        dbConfig = {};
    }

    dbConfig = _.extend({
        host: '127.0.0.1',
        port: 27017,
        db: this.get('app name'),
        sessionsCollection: 'sessions',
        username: null,
        password: null
    }, dbConfig);

    console.log(dbConfig);

    this.set('db', dbConfig);

};