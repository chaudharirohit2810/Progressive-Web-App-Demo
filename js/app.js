if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then((reg) => {
        console.log('Service Worker Registered', reg.scope)
    }).catch(err => {
        console.log('Error: ', err)
    })
}