module.exports = function routes() {

    this.root('pages#index', { as: 'adminIndex'});

    this.get('/users/table', 'users#table', { as: 'adminUsersTable' });
    this.resources('users', { only: ['index', 'edit', 'update', 'destroy'] });

};
