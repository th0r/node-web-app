var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;
var passportLocal = require('passport-local');
var BadRequestError = passportLocal.BadRequestError;
var bcrypt = require('bcrypt');

var ERRORS = {
    EMAIL_IS_REQUIRED: 'Email обязателен',
    INVALID_EMAIL: 'Некорректный email',
    PASSWORD_IS_REQUIRED: 'Пароль обязателен',
    WRONG_PASSWORD: 'Неправильный пароль',
    USER_NOT_FOUND: 'Пользователь с таким email-ом не найден',
    USER_ALREADY_EXIST: 'Пользователь с таким email-ом уже зарегистрирован',
    INVALID_PASSWORD: 'Пароль должен состоять минимум из 6 знаков'
};

var User = new Schema({

    email: {
        type: Types.Email,
        required: [true, ERRORS.EMAIL_IS_REQUIRED],
        validationError: ERRORS.INVALID_EMAIL,
        unique: [true, ERRORS.USER_ALREADY_EXIST]
    },

    hash: {
        type: String
    }

});

User.static({

    serialize: function (user, cb) {
        cb(null, user.serialize());
    },

    deserialize: function (email, cb) {
        return this.findByEmail(email, cb);
    },

    createLocalStrategy: function () {
        return new passportLocal.Strategy({
            usernameField: 'email',
            passwordField: 'password'
        }, this.authenticate.bind(this));
    },

    authenticate: function (email, password, cb) {
        if (!email) {
            return cb(null, false, {
                message: ERRORS.EMAIL_IS_REQUIRED
            });
        }

        if (!password) {
            return cb(null, false, {
                message: ERRORS.PASSWORD_IS_REQUIRED
            });
        }

        this.findByEmail(email, function (err, user) {
            if (err) {
                // TODO: не показывать детальную информацию об ошибке юзеру
                return cb(err);
            }
            if (user) {
                return user.authenticate(password, cb);
            } else {
                return cb(null, false, {
                    message: ERRORS.USER_NOT_FOUND
                });
            }
        });
    },

    findByEmail: function (email, cb) {
        var query = this.findOne({
            email: (email || '').toLowerCase()
        });

        if (cb) {
            query.exec(cb);
        }

        return query;
    },

    register: function (user, password, cb) {
        var self = this;

        if (!(user instanceof this)) {
            if (typeof user === 'string') {
                user = {
                    email: user
                }
            }
            user = new this(user);
        }

        user.validate(function (err) {
            if (err) {
                return cb(err);
            }

            self.findByEmail(user.email)
                .select('email')
                .exec(function (err, existingUser) {
                    if (err) {
                        // TODO: не показывать детальную информацию об ошибке юзеру
                        return cb(err);
                    }

                    if (existingUser) {
                        return cb(new Error(ERRORS.USER_ALREADY_EXIST));
                    }

                    user.setPassword(password, function (err, user) {
                        if (err) {
                            // TODO: не показывать детальную информацию об ошибке юзеру
                            return cb(err);
                        }

                        user.save(function (err) {
                            if (err) {
                                // TODO: не показывать детальную информацию об ошибке юзеру
                                return cb(err);
                            }

                            cb(null, user);
                        });
                    });
                });
        });
    }

});

User.method({

    serialize: function () {
        return this.email;
    },

    authenticate: function (password, cb) {
        var self = this;

        if (!password) {
            return cb(null, false, {
                message: ERRORS.WRONG_PASSWORD
            });
        }

        bcrypt.compare(password, this.hash, function (err, res) {
            if (err) {
                // TODO: не показывать детальную информацию об ошибке юзеру
                return cb(err);
            }

            return res ? cb(null, self) : cb(null, false, {
                message: ERRORS.WRONG_PASSWORD
            });
        });
    },

    setPassword: function (password, cb) {
        var self = this;

        if (!password) {
            return cb(new Error(ERRORS.PASSWORD_IS_REQUIRED));
        }

        bcrypt.genSalt(function (err, salt) {
            if (err) {
                return cb(err);
            }
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) {
                    return cb(err);
                }
                self.hash = hash;
                cb(null, self);
            });
        });
    }

});

module.exports = mongoose.model('User', User);