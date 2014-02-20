var _ = require('lodash');
var Empty = function () {};

/**
 * Функция для работы с классами.
 *
 * @param {Function} Class  Расширяемый класс.
 * @param {Function} [SuperClass]  Если указан, то класс Class будет унаследован он данного класса.
 * @param {Array} [Mixins]  Массив миксинов, которые будут подмешаны в прототип нового класса.
 * @param {Object} [instanceAttributes]  Объект со свойствами и методами создаваемого класса (будет вмержен в прототип класса).
 * @returns {Object}  Прототип нового класа.
 */
module.exports = function (Class, SuperClass, Mixins, instanceAttributes) {
    var argsLen = arguments.length,
        mixedAttributes,
        proto;

    if (argsLen < 3) {
        if (_.isPlainObject(SuperClass)) {
            instanceAttributes = SuperClass;
            SuperClass = null;
        }
    } else if (argsLen < 4) {
        instanceAttributes = Mixins;
        if (Array.isArray(SuperClass)) {
            Mixins = SuperClass;
            SuperClass = null;
        } else {
            Mixins = null;
        }
    }

    // Extending
    if (SuperClass) {
        Empty.prototype = SuperClass.prototype;
        Class.prototype = new Empty();
    }

    // Mixins
    if (Mixins) {
        mixedAttributes = {};
        Mixins.forEach(function (Mixin) {
            _.merge(mixedAttributes, Mixin);
        });
        instanceAttributes = _.merge(mixedAttributes, instanceAttributes);
    }

    // Adding class attributes
    proto = Class.fn = Class.prototype;
    _.assign(proto, instanceAttributes);

    proto.constructor = Class;
    if (SuperClass) {
        proto.$super = SuperClass.prototype;
    }

    return proto;
};