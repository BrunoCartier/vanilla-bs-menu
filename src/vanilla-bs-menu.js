/*jslint browser: true */
(function () {
    'use strict';

    function debounce(func, threshold, execAsap) {
        // Source here:
        // http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
        var timeout;

        return function debounced() {
            var obj = this,
                args = arguments;

            function delayed() {
                if (!execAsap) {
                    func.apply(obj, args);
                }

                timeout = null;
            }

            if (timeout) {
                clearTimeout(timeout);
            } else if (execAsap) {
                func.apply(obj, args);
            }

            timeout = setTimeout(delayed, threshold || 100);
        };
    }

    function throttle(callback, limit) {
        // Source here:
        // http://sampsonblog.com/749/simple-throttle-function
        var wait = false;

        return function () {
            if (!wait) {
                callback.call();
                wait = true;
                setTimeout(function () {
                    wait = false;
                }, limit);
            }
        };
    }

    var // Constants
        TRANSITION_CLASS = 'transition',
        TRANSITION_DURATION = 300,
        SHOWED_CLASS = 'showed',
        HIDDEN_CLASS = 'un-showed',
        VISIBLE_CLASS = 'visible',

        // Variables
        isInit = false,
        menu,
        button,
        matchmedia = window.matchMedia('(max-width: 768px)'),

        // Functions
        addClass,
        removeClass,
        onResize,
        show,
        hide,
        toggle,
        init,
        unInit;

    addClass = function (element, className) {
        if (!element.classList.contains(className)) {
            element.classList.add(className);
        }
    };

    removeClass = function (element, className) {
        if (element.classList.contains(className)) {
            element.classList.remove(className);
        }
    };

    onResize = debounce(function () {
        function isMatchingMedia() {
            return matchmedia.matches;
        }

        if (isMatchingMedia() && !isInit) {
            init();
        } else if (!isMatchingMedia() && isInit) {
            unInit();
        }
    });

    show = function (element) {
        addClass(element, VISIBLE_CLASS);
        removeClass(element, HIDDEN_CLASS);
        addClass(element, SHOWED_CLASS);
        element.setAttribute('aria-expanded', 'true');
    };

    hide = function (element) {
        removeClass(element, SHOWED_CLASS);
        addClass(element, HIDDEN_CLASS);
        setTimeout(function () {
            removeClass(element, VISIBLE_CLASS);
        }, TRANSITION_DURATION);
        element.setAttribute('aria-expanded', 'false');
    };

    toggle = function (element) {
        if (element.getAttribute('aria-expanded') === 'true') {
            hide(element);
        } else {
            show(element);
        }
    };

    init = function () {
        addClass(menu, TRANSITION_CLASS);
        hide(menu);
        isInit = true;
    };

    unInit = function () {
        removeClass(menu, VISIBLE_CLASS);
        removeClass(menu, HIDDEN_CLASS);
        removeClass(menu, SHOWED_CLASS);
        removeClass(menu, TRANSITION_CLASS);
        menu.removeAttribute('aria-expanded');
        isInit = false;
    };

    (function () {
        removeClass(document.documentElement, 'no-js');
        addClass(document.documentElement, 'has-js');

        if (document.createElement('a').classList !== undefined &&
                window.matchMedia !== undefined) {
            menu = document.getElementById('menu-toggled');
            button = document.getElementById('menu-toggler');

            onResize();
            window.addEventListener('resize', onResize);
            button.addEventListener('click', throttle(function () {
                toggle(menu);
            }, TRANSITION_DURATION));
        }
    }());
}());
