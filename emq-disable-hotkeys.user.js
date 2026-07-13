// ==UserScript==
// @name         EMQ disable hotkeys
// @namespace    https://github.com/hyther1111
// @version      1.0
// @description  Disable pause/skip hotkey
// @author       Hyther
// @match        https://erogemusicquiz.com/QuizPage
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        if (e.key.toUpperCase() === 'P' || e.key.toUpperCase() === 'S') {
            const active = document.activeElement;
            const isTyping = active &&
                           (active.tagName === 'INPUT' ||
                            active.tagName === 'TEXTAREA' ||
                            active.isContentEditable);

            if (!isTyping) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        }
    }, true);
})();
