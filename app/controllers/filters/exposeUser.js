module.exports = function (next) {
    this.user = this.req.user;
    next();
};