var _ = require('lodash');
var Q = require('q');
var extend = require('../../utils/extend');
var escapeRegexp = require('../../utils/escape').regexp;
var SpaController = require('./SpaController');
var User = require('../../models/User');

function AdminUsersController() {
    SpaController.call(this);
}

extend(AdminUsersController, SpaController, {

    index: function () {
        return ['User 1', 'User 2'];
    },

    table: function () {
        var self = this;
        var params = this.req.query || {};
        var cols = params.sColumns.split(',');
        var sort = {};
        var totalUsersCount = User.count().exec();
        var filteredUsers = User.find();

        // Making filter
        if (params.sSearch) {
            filteredUsers.where(
                'email',
                new RegExp(escapeRegexp(params.sSearch), 'i')
            );
        }

        // Getting total count of filtered records
        var totalFilteredUsersCount = filteredUsers.count().exec();

        // Generating sort
        for (var i = 0; i < params.iSortingCols; i++) {
            sort[cols[params['iSortCol_' + i]]] = params['sSortDir_' + i];
        }

        filteredUsers
            .find()
            .select(cols.join(' '))
            .skip(params.iDisplayStart || 0)
            .limit(params.iDisplayLength || 20)
            .sort(sort);

        Q.all([totalUsersCount, totalFilteredUsersCount, filteredUsers.exec()])
            .spread(function (total, totalFiltered, users) {
                self.res.json({
                    iTotalRecords: total,
                    iTotalDisplayRecords: totalFiltered,
                    sEcho: Number(params.sEcho),
                    data: users.map(function (user) {
                        var json = _.pick(user, cols);

                        json.url = self.editAdminUserPath(user);

                        return json;
                    })
                });
            })
            .fail(this.jsonError.bind(this));
    },

    new: function () {
        this.rolesList = User.listRoles();
        this.render('newUser');
    },

    edit: function () {
        var self = this;
        var user = User.findById(this.req.params.id).exec();

        Q(user)
            .then(function (user) {
                self.user = user;
                self.rolesList = User.listRoles();
                self.render('editUser');
            })
            .fail(function (err) {
                self.render('userNotFound');
            });
    },

    create: function () {
        var self = this;
        var body = this.req.body;
        var user = new User({
            email: body.email,
            // BUGFIX: Setter не вызывается, если значение === undefined
            // https://github.com/LearnBoost/mongoose/issues/1892
            roles: body.roles || []
        });

        Q.ninvoke(User, 'register', user, body.password)
            .then(function (user) {
                self.res.json({
                    message: 'Учетная запись пользователя успешно создана',
                    redirectTo: self.editAdminUserPath(user)
                });
            })
            .catch(function (err) {
                self.jsonError(err);
            });
    },

    update: function () {
        var self = this;

        Q(User.findById(this.req.params.id).exec())
            .then(function (user) {
                if (user) {
                    var params = self.req.body || {};

                    // Do not allow to change user's password
                    delete params.hash;
                    // Remove user roles if needed
                    params.roles = params.roles || [];

                    user.set(params);

                    return Q.ninvoke(user, 'save');
                } else {
                    throw 'Данного пользователя не существует';
                }
            })
            .spread(function (user) {
                self.res.json({
                    message: 'Учетная запись пользователя успешно изменена'
                });
            })
            .catch(function (err) {
                self.jsonError(err);
            });
    },

    destroy: function () {
        var self = this;
        var userId = this.req.params.id;

        Q(User.findByIdAndRemove(userId).exec())
            .then(function () {
                self.res.json({
                    message: 'Учетная запись пользователя успешно удалена',
                    redirectTo: self.adminUsersPath()
                });
            })
            .catch(function (err) {
                self.jsonError(err);
            })
    }

});

module.exports = AdminUsersController;