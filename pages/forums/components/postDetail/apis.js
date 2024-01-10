import { request } from 'service/index'

// 纠错提交接口
export const getDetail = (params = {}) => {
  return request(
    {
      url: '/api/forum/postDetail',
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
  getDetail
}