module.exports = function (mongoose) {
    var Types = mongoose.Schema.Types;

    Types.Email = require('./email');
};