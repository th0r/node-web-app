module.exports = function (req, res) {

    console.log(req.path);
    if (req.accepts('html')) {
        console.log('html');
        res.render('404');
    } else if (req.accepts('json')) {
        res.send({
            error: 'Not found'
        });
    } else {
        console.log('text');
        res.send('Not found');
    }

};