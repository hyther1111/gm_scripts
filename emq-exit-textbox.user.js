// ==UserScript==
// @name         EMQ Exit Textbox
// @namespace    https://github.com/hyther1111
// @version      1.0
// @description  Exit textbox with `
// @author       Hyther
// @match        https://erogemusicquiz.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        if (e.key === '`' || e.key === 'Backquote') {
            const active = document.activeElement;

            if (active &&
                (active.tagName === 'INPUT' ||
                 active.tagName === 'TEXTAREA' ||
                 active.isContentEditable)) {

                active.blur();
                e.preventDefault();
            }
        }
    });
})();
