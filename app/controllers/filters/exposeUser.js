module.exports = function (userPropertyName) {
    userPropertyName = userPropertyName || 'currentUser';

    return function (next) {
        this[userPropertyName] = this.req.user;
        next();
    };
};