module.exports = function (req, res) {
    res.render('index', {
        scripts: ['app/index']
    });
};