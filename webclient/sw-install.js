(function() {
    console.debug('service worker is disabled for now.');
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            console.log('uninstalling old service worker');
            registration.unregister();
        } 
    });
    return; // no service worker until we iron bugs out of caching
    let queryParams = new Map(location.search.slice(1).split('&').map(t=>t.split('=')));
    if (location.hostname === 'localhost' && queryParams.get('sw') !== 'test') {
        console.log('service worker disabled on localhost');
        return;
    }
    if(!('serviceWorker' in navigator)) {
        console.log('service worker not supported');
        return;
    }
    navigator.serviceWorker.register('./sw.js').then(function(registration) {
    // Registration was successful 😊
        console.log('ServiceWorker registration successful with scope: ',
      registration.scope);
    }).catch(function(err) {
    // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
    });
})();
