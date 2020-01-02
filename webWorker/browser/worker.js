
postMessage({ type: 'start', data: 'success' })

self.addEventListener('message', (e) => {
    let { type, data } = e.data;
    switch (type) {
        case 'sum':
            sum(data)
            break;
        case 'run':
            run()
            break;
        case 'stop':
            stop()
            break;
        default:
            break;
    }
})

function sum(data) {
    let sum = 0;
    data.forEach(num => {
        sum += num;
    });
    postMessage({ type: 'sum', data: sum })
}
var count = 0;
var timer = null;

function run() {
    timer = setInterval(() => {
        postMessage({ type: 'run', data: ++count })
    })
}

function stop() {
    clearInterval(timer);
}
