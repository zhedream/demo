
// 动态 yAxis 计算


function Gettoolbox(num) {
  return {
    right: num == undefined ? 20 : num,
    feature: {
      dataZoom: {},
      saveAsImage: {},
      /* restore: {},
       magicType: {
           type: ['line', 'bar']
       },*/
      // brush: {},
    }
  }
}

//手柄的 icon 形状，支持路径字符串
function handleIcon(Icon) {
  if (Icon == "○") {
    return 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z';
  } else {
    return 'M8.2,13.6V3.9H6.3v9.7H3.1v14.9h3.3v9.7h1.8v-9.7h3.3V13.6H8.2z M9.7,24.4H4.8v-1.4h4.9V24.4z M9.7,19.1H4.8v-1.4h4.9V19.1z';
  }
}

// 原图 option
function handle_modal_line_data(arr, codeList) {
  const title = arr.length > 0 ? arr[0].pointName : "" + "多污染分析";
  vmSingle.echartsTitle = title;
  const toolbox = Gettoolbox();
  const dataZoom_handleIcon = handleIcon("○");
  arr.sort(function (a, b) {
    let aDate = new Date(a.monitorTime);
    let bDate = new Date(b.monitorTime);
    return aDate.getTime() - bDate.getTime();
  });
  const dataX = arr.map((item) => item.monitorTime); // X轴: 时间
  // 1. 一条线 的数据,  对应 code 的数据
  const getCodesData_base = (arr, codeList) => {
    let obj = {};
    let get = $.$safeGetData;
    codeList.forEach(({ pollutantCode }) => (obj[pollutantCode] = [])); // init
    codeList.forEach((code) => {
      const { pollutantCode, pollutantName, unit } = code;
      if (pollutantCode === "a01008") {
        return;
      }
      arr.forEach((item) => {
        if (pollutantCode === "a01007") {
          obj[pollutantCode].push({
            value: get(item, ["a01007", "strength"]),
            symbolRotate: 180 - WindAngleSwitch(get(item, ["a01008", "strength"])), // 角度
            a01007: get(item, ["a01007"]),
            a01008: get(item, ["a01008"]),
            unit,
          });
        } else if (pollutantCode === "PM") {
          obj[pollutantCode].push({
            value: get(item, [pollutantCode, "strength"])
              ? get(item, [pollutantCode, "strength"])
              : undefined, // Y轴, strength
            unit,
            [pollutantCode]: item[pollutantCode],
          });
        } else {
          obj[pollutantCode].push({
            value: get(item, [pollutantCode, "strength"]), // Y轴, strength
            unit,
            [pollutantCode]: item[pollutantCode],
          });
        }
      });
    });
    return obj;
  };
  const codes_data = getCodesData_base(arr, codeList);
  // 数据 tooltip formatter
  const tooltip_formatter = function (params) {
    let item = params[0];
    const MonitorTime = item.axisValue; // trigger 为 x 轴
    let get = $.$safeGetData;
    return (
      `${MonitorTime}<br/>` +
      params
        .map((item) => {
          const { marker, seriesName, value, data } = item;
          const { unit, a01007, a01008, PM } = data;
          if (a01007) {
            return `${marker}
                      风速风向:
                      ${a01007 === undefined ? "--" : get(a01007, ["strength"])}
                      ${unit ? unit : ""}
                      ${a01008 === undefined
                ? "--"
                : WindSwitch(get(a01007, ["strength"]), get(a01008, ["strength"]))
              }`;
          } else {
            return `${marker} ${seriesName}:
              ${value && value != "--" ? value : ""}
              ${unit ? unit : ""}`;
          }
        })
        .join("<br/>")
    );
  };

  // 一条线 的基本样式
  const series_line_base = {
    type: "line",
    // name: 'PM2.5',
    // data: [{ value: '', }],
  };
  const series_line_wind = {
    type: "line",
    // lineStyle: {},
    // itemStyle: {},
    // 符号
    symbol:
      "path://M6.987,75.918c-1.108,0-2.165-0.478-2.927-1.364c-1.041-1.21-1.246-2.85-0.535-4.279L36.144,4.689   c0.664-1.334,2.001-2.163,3.492-2.163c0,0,0,0,0.001,0c1.489,0,2.827,0.829,3.489,2.163l32.62,65.586   c0.711,1.429,0.506,3.069-0.535,4.279s-2.631,1.657-4.15,1.169L40.524,57.9c-0.582-0.187-1.195-0.187-1.777,0L8.21,75.724   C7.804,75.854,7.392,75.918,6.987,75.918z", // 风向符号
    symbolSize: 15, // 大小
    symbolOffset: [0, 0], // 偏移
    // name: 'legend_name,
    // data: dataY,
  };

  // 2. 构建 series
  let series = [];
  codeList.forEach((item) => {
    const { pollutantCode, pollutantName, unit } = item;
    if (pollutantCode == "a01008") return;
    if (pollutantCode == "a01007") {
      series.push({
        code: pollutantCode,
        name: "风速风向",
        data: codes_data[pollutantCode],
        ...series_line_wind,
      });
    } else {
      series.push({
        code: pollutantCode,
        name: pollutantName,
        data: codes_data[pollutantCode],
        ...series_line_base,
      });
    }
  });
  return { title, toolbox, dataZoom_handleIcon, dataX, series, tooltip_formatter };
}

// 处理 y 轴 隐藏
function handleyAxisShow(yAxisAll, code2Name, codes) {
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

  })

}

// 处理 Y 轴, 位置,  基本偏移 + 位置偏移
function handleyAxisOffset(yAxisAll) {
  let yAxis = [];
  let lastLeftOffset = 0;
  let lastRightOffset = 0;
  const calcOffset = (item, lastOffset) => {
    const baseOffset = 30;
    let moreOffset = 0;
    return lastOffset + baseOffset + moreOffset;
  };

  yAxisAll
    .filter((v) => v.show !== false)
    .forEach((item, index) => {
      item.offset = item.offset || 0;
      if (index === 0) {
        item.position = "left";
        item.offset += 0;
      } else if (index === 1) {
        item.position = "right";
        item.offset += 0;
      } else if (index === 2) {
        item.position = "right";
        item.offset += calcOffset(item, lastRightOffset);
        lastRightOffset = item.offset;
      } else {
        // index >=3, 奇左, 偶右
        if (index % 2 === 1) {
          item.position = "left";
          item.offset += calcOffset(item, lastLeftOffset);
          lastLeftOffset = item.offset;
        } else {
          item.position = "right";
          item.offset += calcOffset(item, lastRightOffset);
          lastRightOffset = item.offset;
        }
      }
      yAxis.push(item);
    });

  return yAxis;
}

// 处理 系列 对应 yAxis 的索引, code2name , code 对应 y 轴名称
function handleSeriesIndex(series, yAxisAll, code2Name) {

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

function get_modal_line_option(arr, codes) {
  const try_handle_modal_line_data = (...params) => {
    let data;
    try {
      data = handle_modal_line_data(...params);
    } catch (error) {
      console["error"](error);
    }
    return data;
  };
  const { title, toolbox, dataZoom_handleIcon, dataX, series, tooltip_formatter } = try_handle_modal_line_data(arr, codes);

  // 筛选 Y 轴
  // 定义 Y 轴
  let yAxisAll = [
    {
      type: "value",
      name: "浓度",
      position: "left",
      // axisLabel: { formatter: "{value}" },
    },
    {
      type: "value",
      name: "风速",
      position: "left",
      // axisLabel: { formatter: "{value}" },
    },
    {
      type: "value",
      name: "CO",
      position: "right",
      // axisLabel: { formatter: "{value}" },
    },
    {
      type: "value",
      name: "PM",
      position: "right",
      // axisLabel: { formatter: "{value}" },
    },
    {
      name: "OU",
      type: "value",
      position: "right",
      // axisLabel: { formatter: "{value}" },
    },
    {
      name: "温湿度",
      type: "value",
    }
  ];

  // 因子对应的 Y 轴 名称
  let code2Name = {
    a01007: "风速",
    a21005: "CO",
    PM: "PM",
    ou: "OU",
    a01002: "温湿度",
    a01001: "温湿度",
  };

  handleyAxisShow(yAxisAll, code2Name, series.map(v => v.code));
  yAxisAll = yAxisAll.filter(v => v.show);

  handleyAxisOffset(yAxisAll);

  handleSeriesIndex(series, yAxisAll, code2Name);

  return {
    title: {
      textAlign: "center",
      text: title,
      top: 0,
      left: "center",
    },
    clear: true,
    toolbox,
    tooltip: {
      trigger: "axis",
      formatter: tooltip_formatter,
    },
    color: vm.SystemData.echarts_colors,
    legend: {
      icon: "line",
      type: "scroll",
      top: "4%",
    },
    grid: {
      // top: 30,
      bottom: 30,
      left: "5%",
      right: "5%",
      containLabel: true,
    },
    xAxis: {
      boundaryGap: false,
      data: dataX,
      //   name: "时间",
      splitLine: {
        show: false,
      },
      axisLabel: {
        // interval: 3,
        maxInterval: 3600 * 24 * 1000,
      },
    },
    yAxis: yAxisAll,
    dataZoom: [
      {
        //缩进的数据展示条
        type: "inside",
      },
      {
        handleIcon: dataZoom_handleIcon, //想要什么传什么参数○□
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
    series,
  };
}
