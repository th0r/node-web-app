var $ = require('jquery');
var Vue = require('vue');

// ==================================== DataTables defaults ====================================
if ($.fn.dataTable) {
    var defaults = $.fn.dataTable.defaults;

    defaults.aLengthMenu = [25, 50, 100];

    $.extend(true, defaults, {
        bServerSide: true,
        sAjaxDataProp: 'data',
        bJQueryUI: false,
        sPaginationType: 'full_numbers',
        sDom: '<"datatable-header"fl>t<"datatable-footer"ip>',
        oLanguage: {
            sSearch: '<span>Поиск:</span> _INPUT_',
            sLengthMenu: '<span>Кол-во записей на странице:</span> _MENU_',
            sEmptyTable: 'Записей нет',
            sInfo: 'Показаны записи с _START_ по _END_ из _TOTAL_',
            sInfoEmpty: 'Показано 0 записей',
            sZeroRecords: 'Ни одной записи не найдено',
            sInfoFiltered: '(отфильтровано из _MAX_ записей)',
            sLoadingRecords: 'Идет загрузка записей...',
            sProcessing: 'Идет обработка...',
            oPaginate: {
                sFirst: 'Первая',
                sLast: 'Последняя',
                sNext: '>',
                sPrevious: '<'
            }
        },
        bStateSave: true,
        fnStateLoad: function (settings) {
            return JSON.parse(localStorage.getItem(settings.sCookiePrefix + settings.sInstance));
        },
        fnStateSave: function (settings, data) {
            localStorage.setItem(
                settings.sCookiePrefix + settings.sInstance,
                JSON.stringify(data)
            );
        },
        fnPreDrawCallback: function (settings) {
            var $table = settings.oInstance;

            if (!$table.data('uniformed')) {
                $table.data('uniformed', true);
                $table = $(settings.nTableWrapper);
            }

            $table
                .find('select, input')
                .uniform({
                    radioClass: 'choice'
                });
        }
    });
}

// ==================================== Vue configuration ====================================
Vue.config({
    interpolate: false
});

$(function () {

    // ==================================== Hide/show sidebar ====================================
    $('.fullview').click(function () {
        $('body').toggleClass('clean');
        $('#sidebar').toggleClass('hide-sidebar mobile-sidebar');
        $('#content').toggleClass('full-content');
    });

    // ================================ Hide/show action tabs ====================================
    $('.showmenu').click(function () {
        $('.actions-wrapper').slideToggle(100);
    });

    // ===================== Collapsible plugin for main nav ====================================
    $('.expand').collapsible({
        defaultOpen: 'current,third',
        cookieName: 'navAct',
        cssOpen: 'subOpened',
        cssClose: 'subClosed',
        speed: 200
    });

    // ==================================== Uniform ====================================
    $('.ui-datepicker-month, .styled').uniform({
        radioClass: 'choice'
    });

});