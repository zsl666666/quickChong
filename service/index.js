/**
 * 封装微信网络请求，
 */
import { url } from "../utils"

export const request = (options, optionals) => {
  const {
    isLoading = false, // 是否请求中loading
    loadingTitle = '加载中', // 请求中文案
    isErrToast = true, // 是否失败toast提示
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
        resolve(res)
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