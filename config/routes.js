module.exports = function routes() {

    this.root('pages#index', { as: 'index' });
    this.get('/login', 'user#loginForm', { as: 'login' });
    this.post('/login', 'user#login');
    this.get('/logout', 'user#logout', { as: 'logout' });
    this.get('/registration', 'user#registrationForm', { as: 'registration' });
    this.post('/registration', 'user#register');

};
