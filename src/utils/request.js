// 基于axios封装的请求模块
import theAxios from 'axios'
// 导入封装的token方法
import { getToken } from './token.js'
// 导入进度条效果
import NProgress from 'nprogress'
// 导入进度条样式
import 'nprogress/nprogress.css'

const axios = theAxios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1',
  // 设置20秒超时时间
  timeout: 20000
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  NProgress.start()
  // 为请求头添加token验证Authorization字段
  config.headers.Authorization = getToken()
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  NProgress.done()
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default axios
