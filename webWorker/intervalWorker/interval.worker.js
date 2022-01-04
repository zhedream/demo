
postMessage({ type: 'ready', data: 'setInterval is ready in worker' })

let setIntervaler = null;
let count = 0;

function start(timeout) {
    setIntervaler = setInterval(() => {
        postMessage({
            type: 'next',
            data: ++count,
        })
    }, timeout)
}
function stop() {
    clearInterval(setIntervaler);
    count = 0;
    self.close();
}

self.addEventListener('message', (e) => {
    let { type, data } = e.data;
    switch (type) {
        case 'start':
            start(data)
            break;
        case 'stop':
            stop()
            break;
        default:
            break;
    }
})
