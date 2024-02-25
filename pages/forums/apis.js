import { request } from 'service/index'

// 获取论坛列表接口
export const getForumList = (params = {}) => {
  return request(
    {
      url: '/api/forum/postList',
      method: 'GET',
      data: {
        ...params
      }
    },
    {
      isLoading: true,
    }
  )
}

// 未读消息数接口
export const getUnReadMessage = (params = {}) => {
  return request(
    {
      url: '/api/forum/unReadMessage',
      method: 'GET',
      data: {
        ...params
      }
    },
    {
      isLoading: false,
    }
  )
}

export default {
  getForumList,
  getUnReadMessage
}