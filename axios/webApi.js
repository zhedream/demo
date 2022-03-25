import axios from 'axios'
// import router from '../router';
const router = [];
import { notification } from 'ant-design-vue';

let api = sessionStorage.getItem('api');
if (api && api[api.length - 1] != '/') {
  api += '/';
  console.log('api: ', api);
}

// 创建 axios 实例
export const service = axios.create({
  baseURL: api ? api : '/api/', // api base_url
  timeout: 1000 * 60 * 15,// 请求超时时间 毫秒
})

//请求拦截
service.interceptors.request.use(config => {
  if (localStorage.token) {
    if (config.data === undefined) config.data = {};
    config.headers['accesskey'] = localStorage.token;
    config.headers['time'] = new Date().format('yyyy-MM-dd hh:mm:ss')
  }
  return config
}, error => {
  return Promise.reject(error)
})

//响应拦截
service.interceptors.response.use(response => {
  if (response.data.requstresult === "-1") {
    console.info('token 失效');
    localStorage.removeItem('token')
    router.push({ path: '/login' })
  }
  return response
}, error => {
  // 取消请求不报错 Cancel{message:undefined}
  if (axios.isCancel(error)) {
    console.info('cancel')
    return Promise.reject(error)
  } else {

    console.info(error.message)
    notification['warn']({
      message: '请求超时',
      description: ((error.response || {}).data || {}).message || error.message || '请求出现错误，请稍后再试',
      duration: 3
    })
    return Promise.reject(error)
  }

})

