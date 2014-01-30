var SECRET_KEYS = ['sessionKey'];
var SECRET_KEY_LENGTH = 64;
var SECRETS_FILE = 'secrets.json';
var fs = require('fs');
var path = require('path');
var readline = require('readline');
var generate = require('password-generator');
var secretsFilePath = path.resolve(__dirname, SECRETS_FILE);
var prompt;

function generateSecretsFile() {
    var secretFileContent = {};

    SECRET_KEYS.forEach(function (key) {
        secretFileContent[key] = generate(SECRET_KEY_LENGTH, false);
    });
    fs.writeFileSync(secretsFilePath, JSON.stringify(secretFileContent, null, '  '));
    console.log('Secrets file has been successfully generated ("' + secretsFilePath + '")');
}

if (fs.existsSync(secretsFilePath)) {
    console.log('Secrets file is already exists ("' + secretsFilePath + '")');
    prompt = readline.createInterface(process.stdin, process.stdout);
    prompt.question('Do you want to overwrite it? [y/N]: ', function(answer) {
        if (answer.toLowerCase() === 'y') {
            generateSecretsFile();
        }
        prompt.close();
    });
} else {
    generateSecretsFile();
}