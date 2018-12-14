import request from './request'
import config from './config'
const headers = {
  Authorization: config.token
}

export const authorize = data => {
  return request({
    url: '/oauth/authorize',
    method: 'get',
    params: data
  })
}

export const getToken = data => {
  return request({
    url: `/oauth/token`,
    method: 'post',
    data
  })
}

export const getHomeTimelines = () => {
  return request({
    url: '/api/v1/timelines/home',
    method: 'get',
    headers
  })
}

export const getCurrentUser = () => {
  return request({
    url: '/api/v1/accounts/verify_credentials',
    method: 'get',
    headers
  })
}
