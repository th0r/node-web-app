module.exports = function (req, res) {
    res
        .status(404)
        .format({
            'html': function () {
                res.render('errors/404.html');
            },
            'json': function () {
                res.send({
                    error: 'Not found'
                });
            },
            'default': function () {
                res.send('Not found');
            }
        });
};