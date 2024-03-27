import { request } from 'service/index'

// 获取每天添加设备次数接口
export const getDeviceDetail = (params = {}) => {
  return request(
    {
      url: '/api/device/detail',
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

// 获取每天添加设备次数接口
export const getCommentList = (params = {}) => {
  return request(
    {
      url: '/api/user/commentList',
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

// 收藏/取消收藏接口
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
  getDeviceDetail,
  getCommentList,
  collectDevice
}