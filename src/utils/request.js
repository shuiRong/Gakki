import axios from 'axios'

const service = axios.create({
  baseURL: 'https://pawoo.net',
  timeout: 5000 // 请求超时时间限制
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
    return Promise.reject(err)
  }
)

export default service
