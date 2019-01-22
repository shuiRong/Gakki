import request from './request'
import config from './config'
const headers = {
  Authorization: config.token
}

export const authorize = params => {
  return request({
    url: '/oauth/authorize',
    method: 'get',
    params
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

// 获取时间线上的toot
export const getStatuses = id => {
  return request({
    url: `/api/v1/statuses/${id}`,
    method: 'get',
    headers
  })
}

// 获取用户发送的toot
export const getUserStatuses = (id, params) => {
  return request({
    url: `/api/v1/accounts/${id}/statuses`,
    method: 'get',
    headers,
    params
  })
}

// 删除toot
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
    url: `/api/v1/statuses/${id}/${favourite ? 'favourite' : 'unfavourite'}`,
    method: 'post',
    headers
  })
}

export const reblog = (id, reblog) => {
  return request({
    url: `/api/v1/statuses/${id}/${reblog ? 'reblog' : 'unreblog'}`,
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

// 屏蔽/取消屏蔽 某人
export const blockAccount = (id, block) => {
  return request({
    url: `/api/v1/accounts/${id}/${block ? 'block' : 'unblock'}`,
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

// 发送toot
export const sendStatuses = data => {
  return request({
    url: '/api/v1/statuses',
    method: 'post',
    data,
    headers
  })
}

// 获取和某人的关系数据
export const getRelationship = id => {
  let query = ''
  id.forEach(item => {
    query += `id[]=${item}&`
  })

  return request({
    url: `/api/v1/accounts/relationships?${query}`,
    method: 'get',
    headers
  })
}

// 获取某人详情数据
export const getAccountData = id => {
  return request({
    url: `/api/v1/accounts/${id}`,
    method: 'get',
    headers
  })
}

// 在个人资料页面置顶/取消置顶
export const setPin = (id, pinned) => {
  return request({
    url: `/api/v1/statuses/${id}/${pinned ? 'unpin' : 'pin'}`,
    method: 'post',
    headers
  })
}

// 上传媒体文件：图片/视频
export const upload = ({ response, description, focus }) => {
  const data = new FormData()

  data.append('file', {
    uri: response.uri,
    type: response.type,
    name: response.fileName
  })
  data.append('description', description)
  data.append('focus', focus)
  return request({
    url: '/api/v1/media',
    method: 'post',
    data: data,
    headers: {
      ...headers,
      'content-type': 'multipart/form-data'
    }
  })
}

// 更新媒体文件参数
export const updateMedia = (id, data) => {
  return request({
    url: `/api/v1/media/${id}`,
    method: 'put',
    data,
    headers
  })
}

// 获取当前实例的emoji
export const getCustomEmojis = () => {
  return request({
    url: '/api/v1/custom_emojis',
    method: 'get',
    headers
  })
}

// 获取通知消息
export const getNotifications = params => {
  return request({
    url: '/api/v1/notifications',
    method: 'get',
    params,
    headers
  })
}

// 清空通知消息
export const clearNotifications = () => {
  return request({
    url: '/api/v1/notifications/clear',
    method: 'post',
    headers
  })
}

// 获取通知消息
export const setProfile = data => {
  return request({
    url: '/settings/profile',
    method: 'get',
    params,
    headers
  })
}

// 获取私信数据
export const getConversations = params => {
  return request({
    url: '/api/v1/conversations',
    method: 'get',
    params,
    headers
  })
}

// 获取屏蔽用户
export const getBlocks = params => {
  return request({
    url: '/api/v1/blocks',
    method: 'get',
    params,
    headers
  })
}

// 获取隐藏用户
export const getMutes = params => {
  return request({
    url: '/api/v1/mutes',
    method: 'get',
    params,
    headers
  })
}
