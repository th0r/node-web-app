var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = mongoose.SchemaTypes;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    email: {
        type: Types.Email,
        required: true
    }
});

User.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameLowerCase: true
});

module.exports = mongoose.model('User', User);