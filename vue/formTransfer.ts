declare const moment: any;
// import * as moment  from "moment";


interface TransferRules {
  [key: string]: TransferFn | TransferMap;

}

interface TransferFn {
  (data: any, key: string, result: any): void;
}

type TransferMap = {
  get: TransferFn;
  set: TransferFn;
}


interface DefaultFormTransferRules {
  common: TransferFn;
  setTimeRange: TransferFn;
  getTimeRange: TransferFn;
  arrayToString: TransferFn;
}

function generateTransferRules<T = any>(call: (rules: DefaultFormTransferRules) => T) {

  const common: TransferFn = (data, key, result) => {
    result[key] = data[key];
  };

  const startTimeKey = "BeginDate";
  const endTimeKey = "EndDate";
  const timeFormat = "YYYY-MM-DD HH:mm:ss";
  const setTimeRange: TransferFn = (data, key, result) => {
    result[key] = [
      data[startTimeKey] ? moment(data[startTimeKey]) : null,
      data[endTimeKey] ? moment(data[endTimeKey]) : null,
    ];
  };
  const getTimeRange: TransferFn = (data, key, result) => {
    result[startTimeKey] = data[key][0] ? data[key][0].format(timeFormat).toString() : "";
    result[endTimeKey] = data[key][1] ? data[key][1].format(timeFormat).toString() : "";
  };

  const arrayToString: TransferFn = (data, key, result) => {
    result[key] = data[key] ? data[key].join(",") : "";
  };
  return call({ common, setTimeRange, getTimeRange, arrayToString });

}


function setFormState(data: any, formState: any, rules: TransferRules) {
  let keys = Object.keys(rules);
  keys.forEach((key) => {
    let fn = rules[key];
    if (typeof fn === "function") {
      fn(data, key, formState);
    } else if (typeof fn === "object") {
      fn.set(data, key, formState);
    }
  });
}

function getFormState<T = any>(formState: any, rules: TransferRules): T {
  let keys = Object.keys(rules);
  let data = {} as T;
  keys.forEach((key) => {
    let fn = rules[key];
    if (typeof fn === "function") {
      fn(formState, key, data);
    } else if (typeof fn === "object") {
      fn.get(formState, key, data);
    }
  });
  return data;
}

function getTransferRules() {

  let keys = ["TaskID", "TaskName", "TaskState", "DateRange", "ProjectID", "CarNumber", "TaskType", "GPSDevice"];
  return generateTransferRules((ruleMap) => {
    return keys.reduce<TransferRules>((rules, key) => {
      switch (key) {
        case "DateRange":
          rules[key] = {
            get: ruleMap.getTimeRange,
            set: ruleMap.setTimeRange,
          };
          break;
        default:
          rules[key] = ruleMap.common;
          break;
      }
      return rules;
    }, {});
  });

  // return {
  //   TaskID: common, // 任务ID
  //   TaskName: common,  // 任务名称
  //   TaskState: common, // 任务状态
  //   DateRange: {
  //     set: setTimeRange, // 开始时间 - 结束时间
  //     get: getTimeRange,
  //   },
  //   ProjectID: common, // 项目ID
  //   CarNumber: common, // 车辆
  //   TaskType: common, // 任务类型
  //   GPSDevice: common, // GPS设备ID
  // };
}


export function getAddTaskFormState(formState: any) {
  // let keys = ["TaskID", "TaskName", "TaskState", "ProjectID", "CarNumber", "TaskType", "GPSDevice"];

  const rules = getTransferRules();
  const data = getFormState(formState, rules);
  console.log(data);
  return data;
}

export function setAddTaskFormState(data: any, formState: any) {
  const rules = getTransferRules();
  setFormState(data, formState, rules);
}



