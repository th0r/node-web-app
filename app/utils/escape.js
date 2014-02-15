var ESCAPE_REGEXP = /[-[\]{}()*+?.,\\^$|#]/g;
var ESCAPE_HTML_REGEXP = /&(?!#?\w+;)|<|>|"|'|\//g;
var ESCAPE_HTML_MAP = {
    '&': '&#38;',
    '<': '&#60;',
    '>': '&#62;',
    '"': '&#34;',
    "'": '&#39;',
    '/': '&#47;'
};

exports.regexp = function (str) {
    return ('' + str).replace(ESCAPE_REGEXP, '\\$&');
};

exports.html = function (html) {
    return html ? ('' + html).replace(ESCAPE_HTML_REGEXP, function (ch) {
        return ESCAPE_HTML_MAP[ch] || ch;
    }) : html;
};