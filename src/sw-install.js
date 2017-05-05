(function() {
  if (location.hostname === 'localhost') {
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
