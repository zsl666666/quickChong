import { request } from 'service/index'

// 纠错提交接口
export const collectDevice = (params = {}) => {
  return request(
    {
      url: '/api/user/collect',
      method: 'POST',
      data: {
        ...params
      }
    },
    {
      isLoading: true,
      loadingTitle: '提交中',
      successMsg: '操作成功'
    }
  )
}

export default {
  collectDevice
}