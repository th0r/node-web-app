var _ = require('lodash');
var Q = require('q');
var extend = require('../../utils/extend');
var escapeRegexp = require('../../utils/escape').regexp;
var AdminController = require('./AdminController');
var User = require('../../models/User');

var AdminUsersController = function () {
    AdminController.call(this);
};

extend(AdminUsersController, AdminController, {

    index: function () {
        this.render('usersList');
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

    edit: function () {
        var self = this;
        var user = User.findById(this.req.params.id).exec();

        Q(user)
            .then(function (user) {
                self.user = user;
                self.rolesList = ['admin', 'suka'];
                self.render('editUser');
            })
            .fail(function (err) {
                self.render('userNotFound');
            });
    },

    update: function () {
        var self = this;
        var userId;

        Q(User.findById(this.req.params.id).exec())
            .then(function (user) {
                if (user) {
                    var params = self.req.body || {};

                    userId = String(user._id);

                    // Do not allow to change user's password
                    delete params.hash;

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