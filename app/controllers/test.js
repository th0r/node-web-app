module.exports = function (req, res) {
    var items = [];

    for (var i = 0; i < 1000; i++) {
        items.push('Motherfucker!!!');
    }

    res.render('test', {
        items: items
    });
};