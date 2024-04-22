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

/**
 *  批量获取echarts base64 图片
 * @param params
 * @returns {Promise<string[]>} base64 图片列表
 */
export async function getEchartB64List2(params) {
  const { width, height, options, type, call } = params;

  // 卡死
  // let pArr = options.map(option => {
  //   return getEchartB64({ width, height, option, type, call })
  // })
  // return Promise.all(pArr);

  // 卡, 但能动
  // let taskList = options.map(option => {
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       getEchartB64({ width, height, option, type, call })
  //         .then(v => resolve(v))
  //     }, 0)
  //   })
  // })
  // return Promise.all(taskList);

  // js 空闲执行

  let taskList = options.map(option => {
    return wrap(() => {
      // return getEchartB64({ width, height, option, type, call })
      return new Promise(resolve => {
        setTimeout(() => {
          getEchartB64({ width, height, option, type, call })
            .then(v => resolve(v))
        }, 0)
      })
    })
  })

  let optionList_p = [];
  return runTaskListRequestIdleCallbackWhile(taskList, (call) => {
    optionList_p.push(call())
  }).then(() => {
    return Promise.all(optionList_p);
  })
}

/**
 *  获取echarts图片base64
 * @param params  参数  width: 宽度, height: 高度, option: 配置, type: 图片类型, call: 回调
 * @returns {Promise<string>} base64 图片
 */
export async function getEchartB64(params) {

  const { width, height, option, type, call } = params;

  let container = document.createElement('div');
  container.style.width = width + "px";
  container.style.height = height + "px";
  const chart = echarts.init(container);

  return getNextB64_p(chart, option, type).then(b64 => {
    chart.clear();
    chart.dispose();
    if (call instanceof Function) call(b64)
    return b64;
  })

}

/**
 * 获取下一个图片base64
 * @param {*} chart  echarts 实例
 * @param {*} option echarts option
 * @param {*} type  图片类型
 * @returns {Promise<string>}
 */
function getNextB64_p(chart, option, type = 'jpg') {


  return new Promise(res => {
    chartOnceEvent(chart, 'finished', () => {
      const image64 = chart.getDataURL({ type });
      return res(image64);
    });
    chart.setOption(option);
  })

}

/**
 * echarts 订阅一次事件
 * @param chart echarts 实例
 * @param eventName 事件名称
 * @param call 回调函数
 */
function chartOnceEvent(chart, eventName, call) {
  let onceFn = function (...p) {
    if (call instanceof Function) call(...p);
    chart.off(eventName, onceFn);
  }
  chart.on(eventName, onceFn);
}

/**
 * base64 转图片
 * @param base64
 * @returns {Promise<HTMLImageElement>}
 */
export async function convertBase64ToImage(base64) {
  let image = new Image();
  return new Promise((res) => {
    image.onload = function () {
      image.onload = null;
      return res(image);
    };
    image.src = base64;
  });
}

// 把 image 转换为 canvas对象
export function convertImageToCanvas(image) {
  // 创建canvas DOM元素，并设置其宽高和图片一样
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  canvas.getContext("2d").drawImage(image, 0, 0);
  return canvas;
}

/**
 * 将 Base64 转换为 canvas对象
 * @param base64 base64 字符串
 * @returns {Promise<HTMLCanvasElement>} canvas对象
 */
export async function convertBase64ToCanvas(base64) {
  let image = await convertBase64ToImage(base64);
  return convertImageToCanvas(image);
}

/**
 * 浏览器空闲时执行任务 while
 * @param tasks 任务列表
 * @param callback 回调函数
 * @param timeout 超时时间
 * @returns {Promise<string>} done
 */
function runTaskListRequestIdleCallbackWhile(tasks, callback, timeout = 200) {
  let taskList = tasks.reverse();
  return new Promise(res => {
    requestIdleCallback(whileRunner, { timeout });

    function whileRunner(deadline) {
      let call;
      while ((deadline.timeRemaining() > 0 || deadline.didTimeout) &&
        (call = taskList.pop(), call instanceof Function)) {
        callback && callback(call);
      }
      if (taskList.length > 0) {
        requestIdleCallback(whileRunner, { timeout });
      } else {
        return res('done');
      }
    }
  })
}

/**
 * 浏览器空闲时执行任务 one
 * @param tasks 任务列表
 * @param callback 回调函数
 * @param timeout 超时时间
 * @returns {Promise<string>} done
 */
function runTaskListRequestIdleCallbackOne(tasks, callback, timeout = 200) {
  let taskList = tasks.reverse();
  return new Promise(res => {
    requestIdleCallback(OneRunner, { timeout });

    function OneRunner(deadline) {
      // 如果帧内有富余的时间，或者超时
      let call;
      if ((call = taskList.pop(), call instanceof Function)) {
        callback && callback(call);
      }
      if (taskList.length > 0) {
        requestIdleCallback(OneRunner, { timeout });
      } else {
        return res('done');

      }
    }
  })
}

// 包装函数
function wrap(fn, ...args) {
  return () => fn(...args);
}
