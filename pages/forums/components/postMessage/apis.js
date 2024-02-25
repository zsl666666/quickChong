import { request } from 'service/index'

// 纠错提交接口
export const postMessage = (params = {}) => {
  return request(
    {
      url: '/api/forum/addPost',
      method: 'POST',
      data: {
        ...params
      }
    },
    {
      isLoading: true,
      loadingTitle: '提交中',
      successMsg: '发帖成功'
    }
  )
}

export default {
  postMessage
}