import { request } from 'service/index'

// 获取我添加的设备列表接口
export const getAddDeviceList = (params = {}) => {
  return request(
    {
      url: '/api/user/myDeviceList',
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

// 获取我纠错的设备列表接口
export const getCorrectList = (params = {}) => {
  return request(
    {
      url: '/api/user/myCorrectList',
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

// 获取我评论的设备列表接口
export const getCommentList = (params = {}) => {
  return request(
    {
      url: '/api/user/myCommentList',
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

// 获取设备详情接口
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

export default {
  getAddDeviceList,
  getCorrectList,
  getCommentList,
  getDeviceDetail
}