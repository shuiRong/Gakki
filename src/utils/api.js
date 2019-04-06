import request from './request'
import mobx from './mobx'

export const apps = (domain, data) => {
  return request({
    baseURL: `https://${domain}`,
    url: '/api/v1/apps',
    method: 'post',
    data
  })
}

export const authorize = (domain, params) => {
  return request({
    baseURL: `https://${domain}`,
    url: '/oauth/authorize',
    method: 'get',
    params
  })
}

export const getToken = (domain, data) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/oauth/token`,
    method: 'post',
    data
  })
}

export const getHomeTimelines = (domain, url, params) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/timelines/${url}`,
    method: 'get',
    headers: {
      Authorization: mobx.access_token
    },
    params
  })
}

export const getFavourites = (domain, params) => {
  return request({
    baseURL: `https://${domain}`,
    url: `api/v1/favourites`,
    method: 'get',
    headers: {
      Authorization: mobx.access_token
    },
    params
  })
}

export const getCurrentUser = domain => {
  return request({
    baseURL: `https://${domain}`,
    url: '/api/v1/accounts/verify_credentials',
    method: 'get',
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 获取时间线上的toot
export const getStatuses = (domain, id) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/statuses/${id}`,
    method: 'get',
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 获取用户发送的toot
export const getUserStatuses = (domain, id, params) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/accounts/${id}/statuses`,
    method: 'get',
    headers: {
      Authorization: mobx.access_token
    },
    params
  })
}

// 删除toot
export const deleteStatuses = (domain, id) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/statuses/${id}`,
    method: 'delete',
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 获取评论
export const context = (domain, id) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/statuses/${id}/context`,
    method: 'get',
    headers: {
      Authorization: mobx.access_token
    }
  })
}

export const favourite = (domain, id, favourite) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/statuses/${id}/${favourite ? 'favourite' : 'unfavourite'}`,
    method: 'post',
    headers: {
      Authorization: mobx.access_token
    }
  })
}

export const reblog = (domain, id, reblog) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/statuses/${id}/${reblog ? 'reblog' : 'unreblog'}`,
    method: 'post',
    headers: {
      Authorization: mobx.access_token
    }
  })
}

/**
 * @description 隐藏/取消隐藏 某人
 * @param {notificationStatus}: 是否同时隐藏该用户的通知
 */
export const muteAccount = (domain, id, mute, notificationStatus) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/accounts/${id}/${mute ? 'mute' : 'unmute'}`,
    method: 'post',
    data: {
      notifications: notificationStatus
    },
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 屏蔽/取消屏蔽 某人
export const blockAccount = (domain, id, block) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/accounts/${id}/${block ? 'block' : 'unblock'}`,
    method: 'post',
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 获取隐藏用户列表
export const mutesList = domain => {
  return request({
    baseURL: `https://${domain}`,
    url: '/api/v1/mutes',
    method: 'get',
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 发送toot
export const sendStatuses = (domain, data) => {
  return request({
    baseURL: `https://${domain}`,
    url: '/api/v1/statuses',
    method: 'post',
    data,
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 获取和某人的关系数据
export const getRelationship = (domain, id) => {
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
    }
  })
}

// 获取某人详情数据
export const getAccountData = (domain, id) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/accounts/${id}`,
    method: 'get',
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 在个人资料页面置顶/取消置顶
export const setPin = (domain, id, pinned) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/statuses/${id}/${pinned ? 'unpin' : 'pin'}`,
    method: 'post',
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 上传媒体文件：图片/视频
export const upload = ({ domain, response, description, focus }) => {
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
    }
  })
}

// 更新媒体文件参数
export const updateMedia = (domain, id, data) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/media/${id}`,
    method: 'put',
    data,
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 获取当前实例的emoji
export const getCustomEmojis = domain => {
  return request({
    baseURL: `https://${domain}`,
    url: '/api/v1/custom_emojis',
    method: 'get',
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 获取通知消息
export const getNotifications = (domain, params) => {
  return request({
    baseURL: `https://${domain}`,
    url: '/api/v1/notifications',
    method: 'get',
    params,
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 清空通知消息
export const clearNotifications = domain => {
  return request({
    baseURL: `https://${domain}`,
    url: '/api/v1/notifications/clear',
    method: 'post',
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 获取通知消息
export const setProfile = domain => {
  return request({
    baseURL: `https://${domain}`,
    url: '/settings/profile',
    method: 'get',
    params,
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 获取私信数据
export const getConversations = (domain, params) => {
  return request({
    baseURL: `https://${domain}`,
    url: '/api/v1/conversations',
    method: 'get',
    params,
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 获取屏蔽用户
export const getBlocks = domain => {
  return request({
    baseURL: `https://${domain}`,
    url: '/api/v1/blocks',
    method: 'get',
    params: {
      limit: 100
    },
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 获取隐藏用户
export const getMutes = domain => {
  return request({
    baseURL: `https://${domain}`,
    url: '/api/v1/mutes',
    method: 'get',
    params: {
      limit: 100
    },
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 正在关注
export const following = (domain, id, limit) => {
  return request({
    baseURL: `https://${domain}`,
    url: `api/v1/accounts/${id}/following`,
    method: 'get',
    params: {
      limit: limit || 1
    },
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 关注者
export const followers = (domain, id, limit) => {
  return request({
    baseURL: `https://${domain}`,
    url: `api/v1/accounts/${id}/followers`,
    method: 'get',
    params: {
      limit: limit || 1
    },
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 关注/取关
export const follow = (domain, id, follow) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/accounts/${id}/${follow ? 'follow' : 'unfollow'}`,
    method: 'post',
    data: {
      reblogs: true // 是否在你的时间线展示该用户转嘟的数据
    },
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 关注请求列表
export const followRequests = domain => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/follow_requests`,
    method: 'get',
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 审核关注请求
export const checkRequest = (domain, id, status) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/follow_requests/${id}/${status ? 'authorize' : 'reject'}`,
    method: 'post',
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 搜索
export const search = (query, domain) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v2/search`,
    method: 'get',
    params: {
      query
    },
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 获取标签内容
export const getTag = (tag, params) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/timelines/tag/${tag}`,
    method: 'get',
    params,
    headers: {
      Authorization: mobx.access_token
    }
  })
}

// 验证token是否有效
export const verify_credentials = (domain, access_token) => {
  return request({
    baseURL: `https://${domain}`,
    url: `/api/v1/apps/verify_credentials`,
    method: 'get',
    headers: {
      Authorization: access_token
    }
  })
}
