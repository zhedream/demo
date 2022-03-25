import qs from "qs";
import { service } from "./webApi";
import axios from "axios";



export function kclogin() {
  return service({
    method: "post",
    url: "http://www.webkczg.com:8762/auth/login",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify({
      userCode: "bjsdl",
      password: "bjsdl",
    }),
  });
}


export function getHistoryForArcGis(data, callCancelToken) {
  return service({
    method: "post",
    url: "/RealTime/GetHistoryForArcGis",
    data: data,
    cancelToken: new axios.CancelToken(function executor(c) {
      // 设置 cancel token
      if (callCancelToken instanceof Function) callCancelToken(c);
    }),
  });
}