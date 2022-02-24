"use strict";
(function() {

    var btnOpen = document.querySelector(".site-navigation__open");
    var btnClose = document.querySelector(".site-navigation__close");
    var navBody = document.querySelector(".site-navigation__content");

    var navOpen = function(evt) {
        navBody.classList.add("site-navigation__content--show");
        document.addEventListener('keydown', navClose);
    }
    var navClose = function(evt) {

        if (evt.keycode == 27 && navBody.classList.contains("site-navigation__content--show")) {

            navClose();

            document.removeEventListener('keydown');
        }
        navBody.classList.remove("site-navigation__content--show");
        document.removeEventListener('keydown');
    }

    btnOpen.addEventListener('click', navOpen);
    btnClose.addEventListener('click', navClose);


})();