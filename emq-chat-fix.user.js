// ==UserScript==
// @name         EMQ Chat Fix
// @namespace    https://github.com/hyther1111
// @version      2.0
// @description  Fixed chat keeps jumping to bottom randomly. This script fixes it when other people's messages sent, the chat stays still, when you send a message yourself, it jumps to bottom
// @author       Hyther
// @match        https://erogemusicquiz.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    let chat = null;
    let lastScroll = 0;
    let ready = false;
    let userMoving = false;
    let userSentMessage = false;
    let isBottom = true;
    let nativeSetter = null;
    let nativeGetter = null;
    let mutationObserver = null;

    function isChatValid() {
        return chat && chat.isConnected && document.getElementById('chatHistory') === chat;
    }

    function init() {
        const currentChat = document.getElementById('chatHistory');
        if (!currentChat) return false;
        if (isChatValid()) return true;

        chat = currentChat;

        const desc = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollTop');
        nativeSetter = desc.set;
        nativeGetter = desc.get;

        const goToBottom = () => {
            if (ready) return;
            lastScroll = chat.scrollHeight - chat.clientHeight;
            nativeSetter.call(chat, lastScroll);
            ready = true;
            isBottom = true;
        };

        goToBottom();

        if (mutationObserver) mutationObserver.disconnect();

        chat.scrollTo = () => {};
        chat.scroll = () => {};

        Object.defineProperty(chat, 'scrollTop', {
            get() { return lastScroll; },
            set(val) {
                if (userMoving || !ready) {
                    lastScroll = Math.max(0, val);
                }
            },
            configurable: true
        });

        chat.addEventListener('scroll', () => {
            userMoving = true;
            const realTop = nativeGetter.call(chat);
            lastScroll = realTop;
            isBottom = (chat.scrollHeight - realTop - chat.clientHeight) <= 2;

            clearTimeout(window.emqTimer);
            window.emqTimer = setTimeout(() => userMoving = false, 1600);
        }, { passive: true });

        mutationObserver = new MutationObserver(() => {
            if (!ready) return;

            if (userSentMessage || isBottom) {
                userSentMessage = false;
                setTimeout(() => {
                    lastScroll = chat.scrollHeight - chat.clientHeight;
                    nativeSetter.call(chat, lastScroll);
                    isBottom = true;
                }, 40);
            }
        });
        mutationObserver.observe(chat, { childList: true, subtree: true });

        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    userSentMessage = true;
                }
            }, true);
        }

        return true;
    }

    setInterval(() => {
        init();
    }, 450);

    window.addEventListener('load', () => setTimeout(init, 2500));
})();
