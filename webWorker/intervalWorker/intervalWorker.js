const intervalWorker = require("./interval.worker.js");
// import intervalWorker from "./interval.worker.js";

export function setIntervalWorker(call, timeout) {
  let setIntervalWorker = new intervalWorker();

  setIntervalWorker.addEventListener("error", (e) => {
    console.log("error: ", e);
  });
  setIntervalWorker.addEventListener("messageerror", (e) => {
    console.log("messageerror: ", e);
  });

  setIntervalWorker.addEventListener("message", (e) => {
    let { type, data } = e.data;
    if (type == "next") return call(data);
    if (type == "ready") console.log(data);
  });

  setIntervalWorker.postMessage({ type: "start", data: timeout });
  return setIntervalWorker;
}

export function clearIntervalWorker(setIntervalWorker) {
  // setIntervalWorker.terminate();
  setIntervalWorker.postMessage({ type: "stop" });
}
