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

// 隐藏/取消隐藏 某人
export const muteAccount = (id, mute) => {
  return request({
    url: `/api/v1/accounts/${id}/${mute ? 'mute' : 'unmute'}`,
    method: 'post',
    headers
  })
}

// 获取隐藏用户列表
export const mutesList = () => {
  return request({
    url: '/api/v1/mutes',
    method: 'get',
    headers
  })
}

// 屏蔽/取消屏蔽 某人
export const blockAccount = (id, block) => {
  return request({
    url: `/api/v1/accounts/${id}/${block ? 'block' : 'unblock'}`,
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
