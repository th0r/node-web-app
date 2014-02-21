module.exports = function routes() {

    this.root('pages#indexPage', { as: 'index' });
    this.get('/login', 'user#loginPage', { as: 'login' });
    this.post('/login', 'user#login');
    this.get('/logout', 'user#logout', { as: 'logout' });
    this.get('/registration', 'user#registrationPage', { as: 'registration' });
    this.post('/registration', 'user#register');

    this.namespace('admin', require('./admin'));

};
