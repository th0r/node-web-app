module.exports = (function (CustomEvent) {

    if (!CustomEvent) {
        // CustomEvent constructor polyfill
        // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
        CustomEvent = function (name, params) {
            var event = document.createEvent('CustomEvent');

            params = params || {};

            event.initCustomEvent(name,
                    params.bubbles || false,
                    params.cancelable || false,
                    params.detail
            );

            return event;
        };

        CustomEvent.prototype = window.Event.prototype;
    }

    return CustomEvent;

}(window.CustomEvent));