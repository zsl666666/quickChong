// pages/my/components/collectCenter/index.js
import { url } from '../../../../utils/index'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  onShow() {
    this.getDeviceList('')
  },
  // 获取用户所在位置附近的设备列表
  getDeviceList(type) {
    wx.request({
      url: url + '/api/device/dataList',
      method: 'GET',
      data: {
        city: app.globalData.address,
        device_type: type,
        coordinate: '40.132435,116.66116',
        page: 1,
        size: 20,
        ticket: wx.getStorageSync('ticket')
      },
      success: (res) => {
        const data = res.data.data?.list || []
        this.setData({
          searchData: this.data.searchData.concat(data),
          currentPage: (this.data.currentPage * 1) + 1,
          ifLoadMore: data.length === 20
        })
      },
      fail: (err) => {
        console.error(err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
})