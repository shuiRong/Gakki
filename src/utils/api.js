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

export const getHomeTimelines = (url, params) => {
  return request({
    url: `/api/v1/timelines/${url}`,
    method: 'get',
    headers,
    params
  })
}

export const getCurrentUser = () => {
  return request({
    url: '/api/v1/accounts/verify_credentials',
    method: 'get',
    headers
  })
}

export const getStatuses = id => {
  return request({
    url: `/api/v1/statuses/${id}`,
    method: 'get',
    headers
  })
}

export const deleteStatuses = id => {
  return request({
    url: `/api/v1/statuses/${id}`,
    method: 'delete',
    headers
  })
}


// 获取评论
export const context = id => {
  return request({
    url: `/api/v1/statuses/${id}/context`,
    method: 'get',
    headers
  })
}

export const favourite = (id, favourite) => {
  return request({
    url: `/api/v1/statuses/${id}/${favourite ? 'unfavourite' : 'favourite'}`,
    method: 'post',
    headers
  })
}

export const reblog = (id, reblog) => {
  return request({
    url: `/api/v1/statuses/${id}/${reblog ? 'unreblog' : 'reblog'}`,
    method: 'post',
    headers
  })
}

export const mute = (id, muted) => {
  return request({
    url: `/api/v1/statuses/${id}/${muted ? 'unmute' : 'mute'}`,
    method: 'post',
    headers
  })
}

// 发送toot
export const sendStatuses = data => {
  return request({
    url: 'api/v1/statuses',
    method: 'post',
    data,
    headers
  })
}
