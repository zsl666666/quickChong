import { request } from 'service/index'

// 纠错提交接口
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

export default {
  getForumList
}