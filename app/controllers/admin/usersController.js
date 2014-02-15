var AdminController = require('./AdminController');
var _ = require('lodash');
var escapeRegexp = require('../../utils/escape').regexp;
var Q = require('q');
var User = require('../../models/user');

var adminUsersController = new AdminController();

_.extend(adminUsersController, {

    index: function () {
        this.header = {
            title: 'Пользователи',
            description: 'Список зарегистрированных пользователей'
        };
        this.navLine = [
            {
                title: 'Пользователи',
                link: this.adminUsersPath()
            }
        ];
        this.plugins = ['tables/jquery.dataTables'];
        this.render('admin/users/list');
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
                        var json = user.toJSON();

                        json.url = self.adminUserPath(user);
                        delete json._id;

                        return json;
                    })
                });
            })
            .fail(this.jsonError.bind(this));
    }

});

module.exports = adminUsersController;