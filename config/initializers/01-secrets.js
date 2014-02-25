module.exports = function () {
    var secrets;

    try {
        secrets = require('../secrets.json');
    } catch(e) {
        console.log('Error loading "config/secrets.json" file.');
    }

    if (!secrets) {
        try {
            console.log('Generating one...');
            secrets = require('../utils/secretsGenerator')();
        } catch(e) {
            console.error('Error generating secrets file.', e.message);
            console.log(e.stack);
            process.exit(-1);
        }
    }

    this.set('secrets', secrets);
};
