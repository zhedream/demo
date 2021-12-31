// import echarts from "echarts";

const echarts = require('echarts')

export async function getEchartB64List1(params) {
  const { width, height, options, call } = params;

  let container = document.createElement('div');
  container.style.width = width + "px";
  container.style.height = height + "px";
  const chart = echarts.init(container);
  let list = [];
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    let b64 = await getNextB64_p(chart, option)
    if (call instanceof Function) call(i, b64);
    list.push(b64)
  }
  chart.clear();
  chart.dispose();
  return list;
}
export async function getEchartB64List2(params) {
  const { width, height, options, call } = params;

  let pArr = options.map(option => {
    return getEchartB64({ width, height, option, call })
  })

  return Promise.all(pArr);
}

export async function getEchartB64(params) {

  const { width, height, option, call } = params;

  let container = document.createElement('div');
  container.style.width = width + "px";
  container.style.height = height + "px";
  const chart = echarts.init(container);

  return getNextB64_p(chart, option).then(b64 => {
    chart.clear(); chart.dispose();
    if (call instanceof Function) call(b64)
    return b64;
  })

}

function getNextB64_p(chart, option) {

  chart.setOption(option);

  return new Promise(res => {
    chartOnceEvnet(chart, 'finished', () => {
      const imgbase64 = chart.getDataURL();
      return res(imgbase64);
    })
  })

}

function chartOnceEvnet(chart, eventName, call) {
  let onceFn = function (...p) {
    if (call instanceof Function) call(...p);
    chart.off(eventName, onceFn);
  }
  chart.on(eventName, onceFn);
}