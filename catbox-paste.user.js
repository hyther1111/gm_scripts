// ==UserScript==
// @name         catbox/litterbox paste
// @namespace    https://github.com/hyther1111
// @version      1.0
// @description  Directly copy & paste and upload to catbox/litterbox
// @author       Hyther
// @match        https://catbox.moe/*
// @match        https://litterbox.catbox.moe/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    let fileInput = null;

    function findFileInput() {
        return document.querySelector('input[type="file"]');
    }

    function triggerEvents(element) {
        ['change', 'input', 'paste', 'drop'].forEach(ev => {
            element.dispatchEvent(new Event(ev, { bubbles: true, cancelable: true }));
        });
    }

    function init() {
        fileInput = findFileInput();

        if (!fileInput) {
            setTimeout(init, 1000);
            return;
        }

        document.addEventListener('paste', function (e) {
            const items = (e.clipboardData || e.originalEvent.clipboardData).items || [];

            for (let item of items) {
                if (item.kind === 'file' && item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    if (!file) return;

                    const dt = new DataTransfer();
                    dt.items.add(file);

                    fileInput.files = dt.files;
                    triggerEvents(fileInput);

                    if (fileInput.parentElement) {
                        fileInput.parentElement.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    break;
                }
            }
        });
    }

    init();
    setInterval(() => {
        if (!fileInput || !document.body.contains(fileInput)) {
            fileInput = findFileInput();
        }
    }, 2000);

})();
