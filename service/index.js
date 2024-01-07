/**
 * 封装微信网络请求，
 */
import { url } from "../utils/index"

export const request = (options, optionals) => {
  const {
    isLoading = false, // 是否请求中loading
    loadingTitle = '加载中', // 请求中文案
    isErrToast = true, // 是否失败toast提示
    successMsg = '', // 请求成功的提示
  } = (optionals || {})

  if (isLoading) {
    wx.showLoading({
      title: loadingTitle,
    })
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: url + options.url,
      method: options.method || 'GET',
      data: {
        ...options.data,
        ticket: wx.getStorageSync('ticket'), // 身份信息
      },
      success: function(res) {
        if (res?.data.code === 0) {
          if (successMsg) {
            wx.showToast({
              title: successMsg,
              icon: 'success',
            })
          }
          resolve(res?.data || {})
        } else {
          wx.showToast({
            title: res?.data?.msg || '接口异常',
            icon: 'error',
          })
          reject(res)
        }
      },
      fail: function(err) {
        if (isErrToast) {
          wx.showToast({
            title: '接口异常',
            icon: 'error',
          })    
        }
        reject(err)
      },
      complete: res => {
        if (isLoading) {
          wx.hideLoading()
        }
      }
    })
  })
}