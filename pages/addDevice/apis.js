import { request } from 'service/index'

// 获取每天添加设备次数接口
export const getAddTimes = (params = {}) => {
  return request(
    {
      url: '/api/device/getAddTimes',
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
  getAddTimes
}