"use strict";

function loadJs(url) {
    return new Promise((resolve, reject) => {
        let scriptTag = document.createElement('script');
        scriptTag.src = url;
        scriptTag.onload = resolve
        window.body.appendChild(scriptTag);
    });
}
if(!("customElements" in window)) {
    loadJs(window.location.href+"bower_components/webcomponentsjs/webcomponents-lite.js");
}

