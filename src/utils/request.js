import axios from 'axios'
import { Toast } from 'teaset'
import mobx from './mobx'

const service = axios.create({
  baseURL: `https://${mobx.domain}`,
  timeout: 10000 // 请求超时时间限制
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    return config
  },
  err => {
    Promise.reject(err)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  err => {
    console.log('拦截器err:', err)
    if (err && err.error) {
      Toast.message(err.error)
    }

    return Promise.reject(err)
  }
)

export default service
