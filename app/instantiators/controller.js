/**
 * Instantiate object from constructor exported by module.
 */
module.exports = function (mod) {
    if (typeof mod !== 'function') {
        return;
    }

    return new mod();
};
