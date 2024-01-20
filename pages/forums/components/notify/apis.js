import { request } from 'service/index'

// 未读消息数接口
export const getMessageList = (params = {}) => {
  return request(
    {
      url: '/api/forum/messageList',
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

export default {
  getMessageList
}