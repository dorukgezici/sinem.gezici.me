if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(r => {
        console.log('Service Worker registered');
    }).catch(e => {
        console.log('Service Worker registration failed: ', e);
    });
}
