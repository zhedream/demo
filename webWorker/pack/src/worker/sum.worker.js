
postMessage({ type: 'start', data: 'success' })
console.log(11);

self.addEventListener('message', (e) => {
    let { type, data } = e.data;
    switch (type) {
        case 'sum':
            sum(data)
            break;
        default:
            break;
    }
})

function sum(data) {
    let sum = 0;
    console.log(data);
    let arr = data.split(',')

    arr.forEach((num) => {
        sum += Number(num);
    });
    postMessage({ type: 'sum', data: sum })
}
