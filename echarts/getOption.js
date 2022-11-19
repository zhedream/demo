function getOption(headInfo, yData) {
  headInfo = [
    {
      name: "pm10",
      code: "pm10",
    },
  ];

  function getDataItem(item, serieInfo) {
    let code = serieInfo.code;
    let codesIndex = serieInfo.codesIndex;
    const dataIndex = codesIndex[code];
    const curData = item[dataIndex];
    // pollutantCode pollutantName pollutantValue
    return curData.monitorValue;
    // return {
    //   value: curData.monitorValue,
    //   // itemStyle: {
    //   //   color: "#a90000",
    //   // },
    // };
  }

  // function getDataItem_type() {}

  function getData(yData, serieInfo) {
    return yData.map((v) => getDataItem(v, serieInfo));
  }

  function getSerieItem(serieInfo) {
    let yData = serieInfo.dataAll;
    return {
      name: serieInfo.name,
      type: serieInfo.type || "bar",
      stack: serieInfo.stack,
      data: getData(yData, serieInfo),
    };
  }

  const series = headInfo.map((info) => {
    return getSerieItem(info);
  });

  return {
    // ...
    series,
  };
}

function get_tooltip_position() {
  return (pos, params, el, elRect, size) => {
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
  };
}

function get_tooltip_formatter() {
  let get = _.get;
  return (params) => {
    params = [].concat(params);
    params.sort((a, b) => {
      return b.value - a.value;
    });
    let item = params[0];
    const MonitorTime = item.axisValue; // trigger 为 x 轴

    const getItem = (item) => {
      if (item === undefined) return "";
      const { marker, seriesName, data } = item;
      const { code, a01007, a01008, value, unit } = data || {};
      const isWind = code === "a01007" || code === "a01008";
      if (isWind) {
        return `${marker}${seriesName}: 
            风速: ${a01007 === undefined ? "--" : get(a01007, ["avgStrength"])},
            风向: ${
              a01008 === undefined
                ? "--"
                : WindSwitch(
                    get(a01007, ["avgStrength"]),
                    get(a01008, ["avgStrength"])
                  )
            }`;
      } else {
        return `${marker} ${seriesName}: ${value ? value : ""} ${
          unit ? unit : ""
        }`;
      }
    };

    const getTds_str = (pList) => {
      return pList.map((p) => `<td>${getItem(p)}</td>`).join("");
    };

    // 每列 个数
    let colCount = (params.length / (params.length / 30)) | 0;
    let arr1 = chunk(params, colCount); // arr1.length 列的数量
    let arr2 = transpose(arr1); // 行数 arr2.length ,  矩阵转置  列数变
    let trList = arr2.map((pList) => `<tr>${getTds_str(pList)} </tr>`); // 一行
    return (
      `<div>${MonitorTime}</div>` +
      // params.map(getItem).join('<br>');
      `<table>${trList.join("")}</table>`
    );
  };
}

function getFormatter2() {
  return function (params) {
    let item = params[0];
    const time = item.axisValue; // trigger 为 x 轴
    return (
      time +
      "<br/>" +
      params
        .map((item) => {
          const { value } = item;
          const { marker, seriesName } = item;
          return `${marker} ${seriesName}: ${value} μg/m3`;
        })
        .join("<br/>")
    );
  };
}

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

function getOption_demo(data, code) {
  let dataList = [
    ...vmStatistics.checkCodeList,
    ...vmStatistics.pollutantCode2_acf1_option,
  ];
  let d = dataList.find(
    (item) =>
      item.pollutantCode === vmStatistics.PollutantTypeCode ||
      item.pollutantCode === vmStatistics.pollutantCode2_acf1_model
  );
  let PollutantTypeName = "";
  if (d) PollutantTypeName = d.pollutantName;
  const title = "多站点" + PollutantTypeName + "分析";

  let { dataX, series: seriesData } = data;

  let seriesInfo = seriesData.map((item) => {
    return {
      name: item.name,
      type: item.type || "line",
      dataAll: item.data,
    };
  });
  let unit = "";

  function getDataItem(itemArr) {
    const codes = [];
    const codeData = itemArr.reduce((acc, cur) => {
      codes.push(cur.pollutantCode);
      acc[cur.pollutantCode] = cur;
      return acc;
    }, {});

    const isWind = codes.includes("a01007") || codes.includes("a01008");

    if (isWind) {
      unit = codeData.a01007.unit;
      return {
        value: codeData.a01007.avgStrength,
        symbolRotate: 180 - WindAngleSwitch(codeData.a01008.avgStrength),
        unit: codeData.a01007.unit,
        code: "a01007",
        a01007: codeData.a01007,
        a01008: codeData.a01008,
      };
    } else {
      unit = codeData[code].unit;
      return {
        value: codeData[code].avgStrength,
        unit: codeData[code].unit,
        code: code,
        [code]: codeData[code],
      };
    }
  }

  function getData(data = []) {
    try {
      var res = data.map(getDataItem);
    } catch (e) {
      console.error(e);
    }
    return res;
  }

  function getTypeStyle(type = "line") {
    switch (type) {
      case "line":
        return {
          type: "line",
          // name: 'PM2.5',
          // data: [{ value: '', }],
        };
      case "lineWind":
        return {
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
      case "lineArea":
        return {
          type: "line",
          areaStyle: {},
        };

      default:
        return {
          type: "line",
        };
    }
  }

  function getSerieItem(item) {
    let tp = item.type || "line";
    if (code.includes("a01007") || code.includes("a01008")) {
      tp = "lineWind";
    }

    return {
      name: item.name,
      data: getData(item.dataAll),
      ...getTypeStyle(tp),
    };
  }

  let series = seriesInfo.map(getSerieItem);
  const option = {
    animation: false,
    color: vm.SystemData.echarts_colors,
    title: {
      textAlign: "center",
      text: title,
      top: 0,
      left: "center",
    },
    legend: {
      icon: "line",
      type: "scroll",
      left: "2%",
      top: "4%",
      // data: legend_data
    },
    tooltip: {
      trigger: "axis",
      position: get_tooltip_position(),
      formatter: get_tooltip_formatter(),
      appendToBody: true,
    },
    grid: {
      left: "3%",
      right: "4%",
      top: "10%",
      bottom: "6%",
      containLabel: true,
    },
    xAxis: {
      // name: '(h)',
      type: "category",
      data: dataX,
    },
    yAxis: {
      name: unit || "",
      type: "value",
    },
    dataZoom: [
      {
        //缩进的数据展示条
        type: "inside",
      },
      {
        handleIcon: handleIcon("○"),
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
    series: series,
  };
  console.log(option, "option");
  return option;
}
