// const echarts = require("echarts");
import type { EChartsType } from "echarts";
import * as echarts from "echarts";
import type { ManipulateType } from "dayjs";
import dayjs from "dayjs";
import _ from "lodash";
import { defaultsDeep } from "lodash";

export async function getEchartB64List1(params) {
  const { width, height, options, call } = params;

  let container = document.createElement("div");
  container.style.width = width + "px";
  container.style.height = height + "px";
  const chart = echarts.init(container);
  let list = [];
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    let b64 = await getNextB64_p(chart, option);
    if (call instanceof Function) call(i, b64);
    list.push(b64);
  }
  chart.clear();
  chart.dispose();
  return list;
}

type GetEchartB64List2 = {
  width: number;
  height: number;
  options: any[];
  type?: "png" | "jpeg" | "svg";
  call?: (b64: string) => void;
};

/**
 *  批量获取echarts base64 图片
 * @param params
 * @returns {Promise<string[]>} base64 图片列表
 */
export async function getEchartB64List2(params: GetEchartB64List2): Promise<string[]> {
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
            .then(v => resolve(v));
        }, 0);
      });
    });
  });

  let optionList_p = [];
  return runTaskListRequestIdleCallbackWhile(taskList, (call) => {
    optionList_p.push(call());
  }).then(() => {
    return Promise.all(optionList_p);
  });
}


type GetEchartB64 = {
  width: number;
  height: number;
  option: any;
  type?: "png" | "jpeg" | "svg";
  call?: (b64: string) => void;
};


/**
 *  获取echarts图片base64
 * @param params  参数  width: 宽度, height: 高度, option: 配置, type: 图片类型, call: 回调
 * @returns {Promise<string>} base64 图片
 */
export async function getEchartB64(params: GetEchartB64): Promise<string> {


  const { width, height, option, type, call } = params;

  let container = document.createElement("div");
  container.style.width = width + "px";
  container.style.height = height + "px";
  const chart = echarts.init(container);

  return getNextB64_p(chart, option, type).then(b64 => {
    chart.clear();
    chart.dispose();
    if (call instanceof Function) call(b64);
    return b64;
  });

}

/**
 * 获取下一个图片base64
 * @param {*} chart  echarts 实例
 * @param {*} option echarts option
 * @param {*} type  图片类型
 */
function getNextB64_p(chart: EChartsType, option: any, type: "png" | "jpeg" | "svg" = "jpeg") {

  return new Promise<string>(res => {
    chartOnceEvent(chart, "finished", () => {
      const image64 = chart.getDataURL({ type });
      return res(image64);
    });
    chart.setOption(option);
  });

}

/**
 * echarts 订阅一次事件
 * @param chart echarts 实例
 * @param eventName 事件名称
 * @param call 回调函数
 */
function chartOnceEvent(chart, eventName, call) {
  let onceFn = function(...p) {
    if (call instanceof Function) call(...p);
    chart.off(eventName, onceFn);
  };
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
    image.onload = function() {
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
        return res("done");
      }
    }
  });
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
        return res("done");

      }
    }
  });
}

// 包装函数
function wrap(fn, ...args) {
  return () => fn(...args);
}


// 处理 y 轴 隐藏
export function handleYAxisShow(yAxisAll, code2Name, codes) {
  // 需要隐藏的 names
  let hideNames = Object.values(code2Name);
  yAxisAll.forEach(y => {
    y.show = !hideNames.includes(y.name);
  });

  codes.forEach(code => {
    let showName = code2Name[code];
    if (showName) {
      let y = yAxisAll.find(y => y.name === showName);
      if (y) y.show = true;
    }

  });

}

// 函数用于计算文本宽度，并使用缓存来提高性能
function measureTextWidth(text: string, font: string) {
  // 创建一个span元素来测量文本
  const measurementElement = document.createElement("span");
  measurementElement.style.font = font; // 设置字体样式
  measurementElement.style.whiteSpace = "nowrap"; // 确保文本不会换行
  measurementElement.style.position = "absolute"; // 使用绝对定位
  measurementElement.style.visibility = "hidden"; // 隐藏元素，避免影响视觉
  measurementElement.textContent = text;

  document.body.appendChild(measurementElement);
  const width = measurementElement.offsetWidth; // 获取文本宽度
  document.body.removeChild(measurementElement); // 移除元素

  return width;
}

// 处理 Y 轴, 位置,  基本偏移 + 位置偏移
export function handleYAxisOffset(yAxisAll) {
  const measureOffset = (text, lastOffset) => lastOffset + measureTextWidth(text, "12px Arial") + 10;

  let lastOffsets = { left: 0, right: 0 };
  let lastItemName = { left: "", right: "" }; // 分别记录左右两边上一个元素的名称

  return yAxisAll.filter(v => v.show !== false).map((item, index) => {
    item.offset = item.offset || 0;
    let side;

    if (index === 0) {
      side = "left";
      item.nameTextStyle = { align: "right" };
    } else if (index === 1) {
      side = "right";
      item.nameTextStyle = { align: "left" };
    } else {
      side = index % 2 === 0 ? "right" : "left";
      item.offset += measureOffset(lastItemName[side], lastOffsets[side]);
      item.nameTextStyle = { align: side === "left" ? "right" : "left" };
    }

    item.position = side;
    lastOffsets[side] = item.offset;
    lastItemName[side] = item.name; // 更新左右两边上一个元素的名称

    return item;
  });
}

// 处理 系列 对应 yAxis 的索引, code2name , code 对应 y 轴名称
export function handleSeriesIndex(series, yAxisAll, code2Name) {

  // 确定 series yAxisIndex 索引
  let name2Index = {};
  yAxisAll.forEach((item, index) => {
    name2Index[item.name] = index;
  });

  series.forEach((item) => {
    const yName = code2Name[item.code]; // Y 轴名称
    const yIndex = name2Index[yName];
    if (yName !== undefined && yIndex !== undefined) {
      item.yAxisIndex = yIndex;
    } else {
      item.yAxisIndex = 0;
    }
  });
}


export function generateTimes(startTime: dayjs.ConfigType, endTime: dayjs.ConfigType, unit: ManipulateType, format = "YYYY-MM-DD HH:mm:ss", step = 1) {
  let dates: string[] = [];
  let start = dayjs(startTime);
  let end = dayjs(endTime);
  let current = start;
  while (current.isBefore(end, unit) || current.isSame(end, unit)) {
    dates.push(current.format(format));
    current = current.add(step, unit);
  }
  return dates;
}


// 多列表格展示提示框

export function showTable(getItem, params, number = 30) {
  let item = params[0];
  const MonitorTime = item.axisValue; // trigger 为 x 轴

  // 每列 个数
  let colCount = (params.length / (params.length / number)) | 0;
  let arr1 = chunk(params, colCount); // arr1.length 列的数量
  let arr2 = transpose(arr1); // 行数 arr2.length ,  矩阵转置  列数变
  let trList = arr2.map((pList) => `<tr>${getTds_str(getItem, pList)} </tr>`); // 一行
  return (
    `<div>${MonitorTime}</div>` +
    // params.map(getItem).join('<br>');
    `<table>${trList.join("")}</table>`
  );
}

const getTds_str = (getItem, pList) => {
  return pList.map((p) => `<td>${getItem(p)}</td>`).join("");
};

function chunk(arr, count) {
  let result = [];
  let i = 0;
  while (i < arr.length) {
    result.push(arr.slice(i, i + count));
    i += count;
  }
  return result;
}

function transpose(matrix) {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
}

//

// 控制提示框 位置
export function tooltipPosition(pos, params, el, elRect, size) {
// console.log(pos, size);
  const { contentSize, viewSize } = size;
  let isLeft = pos[0] < size.viewSize[0] / 2;
  let key = ["right", "left"][+isLeft];
  // 鼠标在左
  let num;
  if (isLeft) {
    // 在左边 判断 x 到  viewSize[0]
    num = pos[0] + 10;
  } else {
    num = viewSize[0] - pos[0] + 10;
  }

  return {
    top: viewSize[1] / 2 - contentSize[1] / 2,
    [key]: num,
  };
}

// 自定义提示框
const tooltipFormatter = (params) => {
  const getItem = (item) => {
    if (!item) return "";
    const { marker, seriesName, value, data } = item;
    const { unit, a01007, a01008 } = data || {};
    if (a01007) {
      // 风速风向
      return `${marker} ${seriesName}:
                  风速: ${a01007}
                  风向: ${a01008 === undefined ? "--" : isNaN(a01008) ? a01008 : WindSwitch(a01007, a01008)}`;
    } else {
      return `${marker} ${seriesName}:
          ${value && value != "--" ? value : ""}
          ${unit ? unit : ""}`;
    }
  };
  return showTable(getItem, params);
};


// 通用默认的 option
export function getBaseOption(option) {

  const defaultOption = {
    title: {
      text: "暂无标题",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      formatter: tooltipFormatter,
      position: tooltipPosition,
    },
    toolbox: {
      right: 100,
      feature: {
        dataZoom: {},
        saveAsImage: {},
      },
    },
    color: [
      "#ff7f50",
      "#0967f7",
      "#894ae4",
      "#32cd32",
      "#006ea5",
      "#ff69b4",
      "#071B5C",
      "#ffe47b",
      "#82d9ab",
      "#74a8f7",
    ],
    legend: {
      // data: ["AQI", "PM₁₀", "PM₂.₅"],
      left: "center",
      top: 40,
    },
    grid: {
      top: 80,
      right: 60,
      left: 60,
      bottom: 40,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [],
    },
    yAxis: {
      type: "value",
    },
    dataZoom: [
      {
        type: "inside",
      },
      {
        handleIcon: "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
        bottom: 0,
        handleSize: "80%",
        handleStyle: {
          color: "#fff",
          shadowBlur: 3,
          shadowColor: "rgba(0, 0, 0, 0.6)",
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
      },
    ],
    series: [],
  };

  return defaultsDeep(option, defaultOption);
}

export function getBaseYXAxis(series) {
  // 处理 Y 轴
  let yAxis = [];
  yAxis = [
    {
      type: "value",
      name: "浓度(指数)",
      position: "left",
      axisLabel: {
        formatter: "{value}",
      },
    },
    {
      type: "value",
      name: "PM₂.₅/PM₁₀",
      position: "right",
      axisLabel: {
        formatter: "{value}",
      },
    },
    {
      type: "value",
      name: "CO",
      position: "right",
      axisLabel: {
        formatter: "{value}",
      },
    },
    {
      type: "value",
      name: "风速",
      position: "right",
      axisLabel: {
        formatter: "{value}",
      },
    },
  ];

  // series.code 对应 yAxis.name 的关系映射
  let code2Name = {
    a21005: "CO",
    a01007: "风速",
    PM25_10: "PM₂.₅/PM₁₀",
  };

  const codes = series.map(v => v.code);

  handleYAxisShow(yAxis, code2Name, codes);
  yAxis = yAxis.filter(v => v.show);

  handleYAxisOffset(yAxis);

  handleSeriesIndex(series, yAxis, code2Name);

  return yAxis;
}

type CodeInfo = { code: string, name: string, unit: string };

export function getDataItem(timeData, codeInfo: CodeInfo) {
  if (codeInfo.code === "a01007") {
    const a01008_ = _.get(timeData, "a01008");
    // a01008 可能是文字，转数值
    const a01008 = isNaN(a01008_) ? DirectionSwitch(a01008_) : a01008_;
    return {
      value: _.get(timeData, "a01007"),
      symbolRotate: 180 - WindAngleSwitch(a01008), // 角度
      a01007: _.get(timeData, "a01007"),
      a01008: _.get(timeData, "a01008"),
      unit: codeInfo.unit,
    };
  }
  return {
    value: _.get(timeData, codeInfo.code),
    unit: codeInfo.unit,
  };
}

// 构建 series
let windStyle = {
  symbol:
    "path://M6.987,75.918c-1.108,0-2.165-0.478-2.927-1.364c-1.041-1.21-1.246-2.85-0.535-4.279L36.144,4.689   c0.664-1.334,2.001-2.163,3.492-2.163c0,0,0,0,0.001,0c1.489,0,2.827,0.829,3.489,2.163l32.62,65.586   c0.711,1.429,0.506,3.069-0.535,4.279s-2.631,1.657-4.15,1.169L40.524,57.9c-0.582-0.187-1.195-0.187-1.777,0L8.21,75.724   C7.804,75.854,7.392,75.918,6.987,75.918z", // 风向符号
  symbolSize: 15, // 大小
  symbolOffset: [0, 0], // 偏移
};

/**
 * 获取 series item
 * @param name 系列名称
 * @param xAxisData x 轴数据，时间
 * @param time2data 时间到数据的映射 {'2021-01':{a34004:123}}
 * @param codeInfo 因子信息
 */
export function getSeriesItemLine(name, xAxisData, time2data, codeInfo: CodeInfo) {
  return {
    code: codeInfo.code, // 因子编码，处理 yAxis 显示隐藏
    name: name,
    type: "line",
    ...(codeInfo.code === "a01007" ? windStyle : {}), // 风向样式
    smooth: true,
    data: xAxisData.map(time => {
      let timeData = time2data[time];
      return getDataItem(timeData, codeInfo);
    }),
  };
}

// 角度转风向
export function WindSwitch(a01007, a01008) {
  if (a01008 != undefined) {
    if (a01007 != undefined) {
      if (parseFloat(a01007) <= 0.2) {
        return "静风";
      } else if ((parseFloat(a01008) >= 348.76 && parseFloat(a01008) <= 360) || (parseFloat(a01008) >= 0 && parseFloat(a01008) <= 11.25)) {
        return "北风";
      } else if (parseFloat(a01008) >= 11.26 && parseFloat(a01008) <= 33.75) {
        return "北东北风"
      } else if (parseFloat(a01008) >= 33.76 && parseFloat(a01008) <= 56.25) {
        return "东北风"
      } else if (parseFloat(a01008) >= 56.26 && parseFloat(a01008) <= 78.75) {
        return "东东北风"
      } else if (parseFloat(a01008) >= 78.76 && parseFloat(a01008) <= 101.25) {
        return "东风"
      } else if (parseFloat(a01008) >= 101.26 && parseFloat(a01008) <= 123.75) {
        return "东东南风"
      } else if (parseFloat(a01008) >= 123.76 && parseFloat(a01008) <= 146.25) {
        return "东南风"
      } else if (parseFloat(a01008) >= 146.26 && parseFloat(a01008) <= 168.75) {
        return "南东南风"
      } else if (parseFloat(a01008) >= 168.76 && parseFloat(a01008) <= 191.25) {
        return "南风"
      } else if (parseFloat(a01008) >= 191.26 && parseFloat(a01008) <= 213.75) {
        return "南西南风"
      } else if (parseFloat(a01008) >= 213.76 && parseFloat(a01008) <= 236.25) {
        return "西南风"
      } else if (parseFloat(a01008) >= 236.26 && parseFloat(a01008) <= 258.75) {
        return "西西南风"
      } else if (parseFloat(a01008) >= 258.76 && parseFloat(a01008) <= 281.25) {
        return "西风"
      } else if (parseFloat(a01008) >= 281.26 && parseFloat(a01008) <= 303.75) {
        return "西西北风"
      } else if (parseFloat(a01008) >= 303.76 && parseFloat(a01008) <= 326.25) {
        return "西北风"
      } else if (parseFloat(a01008) >= 326.26 && parseFloat(a01008) <= 348.75) {
        return "北西北风"
      } else {
        return ""
      }

    } else if (a01007 == undefined) {
      return ""
    }
  }

}

// 风向转角度
export function DirectionSwitch(Dir) {
  switch (Dir) {
    case "北风":
      return 0;
    case "北东北风":
      return 22.5;
    case "东北风":
      return 45;
    case "东东北风":
      return 67.5;
    case "东风":
      return 90;
    case "东东南风":
      return 112.5;
    case "东南风":
      return 135;
    case "南东南风":
      return 157.5;
    case "南风":
      return 180;
    case "南西南风":
      return 202.5;
    case "西南风":
      return 225;
    case "西西南风":
      return 247.5;
    case "西风":
      return 270;
    case "西西北风":
      return 292.5;
    case "西北风":
      return 315;
    case "北西北风":
      return 337.5;
  }

}

// 角度归整
export function WindAngleSwitch(a01008) {
  if (a01008 != undefined) {
    if ((parseFloat(a01008) >= 348.76 && parseFloat(a01008) <= 360) || (parseFloat(a01008) >= 0 && parseFloat(a01008) <= 11.25)) {
      return 0;
    } else if (parseFloat(a01008) >= 11.26 && parseFloat(a01008) <= 33.75) {
      return 22.5;
    } else if (parseFloat(a01008) >= 33.76 && parseFloat(a01008) <= 56.25) {
      return 45;
    } else if (parseFloat(a01008) >= 56.26 && parseFloat(a01008) <= 78.75) {
      return 67.5;
    } else if (parseFloat(a01008) >= 78.76 && parseFloat(a01008) <= 101.25) {
      return 90;
    } else if (parseFloat(a01008) >= 101.26 && parseFloat(a01008) <= 123.75) {
      return 112.5;
    } else if (parseFloat(a01008) >= 123.76 && parseFloat(a01008) <= 146.25) {
      return 135;
    } else if (parseFloat(a01008) >= 146.26 && parseFloat(a01008) <= 168.75) {
      return 157.5;
    } else if (parseFloat(a01008) >= 168.76 && parseFloat(a01008) <= 191.25) {
      return 180;
    } else if (parseFloat(a01008) >= 191.26 && parseFloat(a01008) <= 213.75) {
      return 202.5;
    } else if (parseFloat(a01008) >= 213.76 && parseFloat(a01008) <= 236.25) {
      return 225;
    } else if (parseFloat(a01008) >= 236.26 && parseFloat(a01008) <= 258.75) {
      return 247.5;
    } else if (parseFloat(a01008) >= 258.76 && parseFloat(a01008) <= 281.25) {
      return 270;
    } else if (parseFloat(a01008) >= 281.26 && parseFloat(a01008) <= 303.75) {
      return 292.5;
    } else if (parseFloat(a01008) >= 303.76 && parseFloat(a01008) <= 326.25) {
      return 315;
    } else if (parseFloat(a01008) >= 326.26 && parseFloat(a01008) <= 348.75) {
      return 337.5;
    }

  }
  return 0;

}
