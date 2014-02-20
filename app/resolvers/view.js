/**
 * "As-is" view resolver to use "camelCase" views instead of locomotive's built-in "underscore-style" resolver.
 */
module.exports = function (id) {
    return id;
};