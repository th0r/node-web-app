module.exports = function (req, res) {
    res.render('registration', {
        scripts: ['app/registration']
    });
};