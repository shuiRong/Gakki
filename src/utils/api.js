import request from './request'
import mobx from './mobx'

export const apps = (domain, data, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: '/api/v1/apps',
    method: 'post',
    data,
    ...options
  })
}

export const getToken = (domain, data, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/oauth/token`,
    method: 'post',
    data,
    ...options
  })
}

export const getHomeTimelines = (domain, url, params, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/timelines/${url}`,
    method: 'get',
    headers: {
      Authorization: mobx.access_token
    },
    params,
    ...options
  })
}

export const getCurrentUser = (domain, access_token, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: '/api/v1/accounts/verify_credentials',
    method: 'get',
    headers: {
      Authorization: access_token || mobx.access_token
    },
    ...options
  })
}

// 获取时间线上的toot
export const getStatuses = (domain, id, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/statuses/${id}`,
    method: 'get',
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 获取用户发送的toot
export const getUserStatuses = (domain, id, params, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/accounts/${id}/statuses`,
    method: 'get',
    headers: {
      Authorization: mobx.access_token
    },
    params,
    ...options
  })
}

// 删除toot
export const deleteStatuses = (domain, id, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/statuses/${id}`,
    method: 'delete',
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 获取评论
export const context = (domain, id, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/statuses/${id}/context`,
    method: 'get',
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

export const favourite = (domain, id, favourite, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/statuses/${id}/${favourite ? 'favourite' : 'unfavourite'}`,
    method: 'post',
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

export const reblog = (domain, id, reblog, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/statuses/${id}/${reblog ? 'reblog' : 'unreblog'}`,
    method: 'post',
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

/**
 * @description 隐藏/取消隐藏 某人
 * @param {notificationStatus}: 是否同时隐藏该用户的通知
 */
export const muteAccount = (domain, id, mute, notificationStatus, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/accounts/${id}/${mute ? 'mute' : 'unmute'}`,
    method: 'post',
    data: {
      notifications: notificationStatus
    },
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 屏蔽/取消屏蔽 某人
export const blockAccount = (domain, id, block, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/accounts/${id}/${block ? 'block' : 'unblock'}`,
    method: 'post',
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 发送toot
export const sendStatuses = (domain, data, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: '/api/v1/statuses',
    method: 'post',
    data,
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 获取和某人的关系数据
export const getRelationship = (domain, id, options) => {
  let query = ''
  id.forEach(item => {
    query += `id[]=${item}&`
  })

  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/accounts/relationships?${query}`,
    method: 'get',
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 获取某人详情数据
export const getAccountData = (domain, id, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/accounts/${id}`,
    method: 'get',
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 在个人资料页面置顶/取消置顶
export const setPin = (domain, id, pinned, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/statuses/${id}/${pinned ? 'unpin' : 'pin'}`,
    method: 'post',
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 上传媒体文件：图片/视频
export const upload = (domain, { response, description, focus }, options) => {
  const data = new FormData()

  data.append('file', {
    uri: response.uri,
    type: response.type,
    name: response.fileName
  })
  data.append('description', description)
  data.append('focus', focus)
  return request({
    baseURL: `https://${domain}`,
    url: '/api/v1/media',
    method: 'post',
    data: data,
    headers: {
      Authorization: mobx.access_token,
      'content-type': 'multipart/form-data'
    },
    ...options
  })
}

// 更新媒体文件参数
export const updateMedia = (domain, id, data, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/media/${id}`,
    method: 'put',
    data,
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 获取当前实例的emoji
export const getCustomEmojis = (domain, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: '/api/v1/custom_emojis',
    method: 'get',
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 获取通知消息
export const getNotifications = (domain, params, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: '/api/v1/notifications',
    method: 'get',
    params,
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 清空通知消息
export const clearNotifications = (domain, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: '/api/v1/notifications/clear',
    method: 'post',
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 获取私信数据
export const getConversations = (domain, params, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: '/api/v1/conversations',
    method: 'get',
    params,
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 获取屏蔽用户
export const getBlocks = (domain, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: '/api/v1/blocks',
    method: 'get',
    params: {
      limit: 100
    },
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 获取隐藏用户
export const getMutes = (domain, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: '/api/v1/mutes',
    method: 'get',
    params: {
      limit: 100
    },
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 正在关注
export const following = (domain, id, limit, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `api/v1/accounts/${id}/following`,
    method: 'get',
    params: {
      limit: limit || 1
    },
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 关注者
export const followers = (domain, id, limit, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `api/v1/accounts/${id}/followers`,
    method: 'get',
    params: {
      limit: limit || 1
    },
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 关注/取关
export const follow = (domain, id, follow, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/accounts/${id}/${follow ? 'follow' : 'unfollow'}`,
    method: 'post',
    data: {
      reblogs: true // 是否在你的时间线展示该用户转嘟的数据
    },
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 关注请求列表
export const followRequests = (domain, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/follow_requests`,
    method: 'get',
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 审核关注请求
export const checkRequest = (domain, id, status, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/follow_requests/${id}/${status ? 'authorize' : 'reject'}`,
    method: 'post',
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 搜索
export const search = (domain, query, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v2/search`,
    method: 'get',
    params: {
      q: query,
      resolve: true,
      limit: 50
    },
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 获取标签内容
export const getTag = (domain, tag, params, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/timelines/tag/${tag}`,
    method: 'get',
    params,
    headers: {
      Authorization: mobx.access_token
    },
    ...options
  })
}

// 验证token是否有效
export const verify_credentials = (domain, access_token, options) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/apps/verify_credentials`,
    method: 'get',
    headers: {
      Authorization: access_token
    },
    ...options
  })
}
