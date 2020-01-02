// import Worker from 'worker-loader!./worker/sum.worker';
const Worker1 = require('./worker/sum.worker.js'); // 目前只能弄出 require 的方法

const Sumer = new Worker1() as Worker;

const btn = document.getElementById('btn');
btn.addEventListener('click', () => {
    const input = document.getElementById('numbers') as HTMLInputElement;
    const data = input.value;
    Sumer.postMessage({ type: 'sum', data })
})

Sumer.addEventListener('message',(e)=>{
    let {type,data} = e.data;
    console.log(type,data);
    let a = document.getElementById('out') as HTMLElement;
    a.innerText = data
})

