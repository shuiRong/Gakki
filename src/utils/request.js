import axios from 'axios'
import { Toast } from 'teaset'

const service = axios.create({
  baseURL: 'https://cmx.im',
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

    return Promise.reject(error)
  }
)

export default service
