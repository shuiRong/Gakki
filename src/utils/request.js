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
  ({ error }) => {
    console.log('拦截器err:', error)
    Toast.message(error)
    return Promise.reject(error)
  }
)

export default service
