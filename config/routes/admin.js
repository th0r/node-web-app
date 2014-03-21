module.exports = function routes() {

    this.root('admin#index', { as: 'adminIndex'});

//    this.get('/users/table', 'users#table', { as: 'adminUsersTable' });
    this.resources('users', { only: ['index', 'new', 'create', 'edit', 'update', 'destroy'] });

    // Catch-all route to serve static app page
    this.get('*', 'spa#serveApp');

};
