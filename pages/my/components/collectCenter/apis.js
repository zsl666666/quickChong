import { request } from 'service/index'

// 纠错提交接口
export const getCollectList = (params = {}) => {
  return request(
    {
      url: '/api/user/collectList',
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
  getCollectList
}