// pages/deviceDetail/index.js

import apis from './apis'
import * as CONFIG from './config'
import Toast from '@vant/weapp/toast/toast';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CONFIG,
    navBarHeight: app.globalData.navBarHeight,
    // 设备图片
    pictures: ['https://gathertrack.oss-cn-beijing.aliyuncs.com/2024/03/JvRXkeKU1jr0bO9o2ZfMTQCcxqyIhBPS.jpg?x-oss-process=image/resize,w_200,h_160', 'https://gathertrack.oss-cn-beijing.aliyuncs.com/2024/03/TtojLp9vQ3cM17miEydAWkGxZqKNwVIl.jpg?x-oss-process=image/resize,w_200,h_160', 'https://gathertrack.oss-cn-beijing.aliyuncs.com/2024/03/C4OwPZe9J5yND6pTIndaLkrjsuU8AmWg.png?x-oss-process=image/resize,w_200,h_160'],
    currentImageIndex: 0, // 当前swiper所在滑块的 index
    deviceData: {}, // 设备详情数据
    commentList: [], // 评论列表
    loadObj: {
      collectLoading: false, // 收藏loading
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getDeviceDetail()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  onShareTimeline() {

  },

  // 获取评论列表数据
  getCommentList(params = {}) {
    apis.getCommentList({
      ...params,
      page: 1,
      size: 10
    }).then(res => {
      this.setData({
        commentList: res?.data?.list || []
      })
    })
  },

  // 获取设备详情接口
  getDeviceDetail() {
    const initUserLocationInfo = getApp().globalData.userLocationInfo
    const latitude = initUserLocationInfo.latitude
    const longitude = initUserLocationInfo.longitude
    const coordinate = `${latitude},${longitude}`
    const id = 21646
    // const coordinate
    apis.getDeviceDetail({
      id,
      coordinate
    }).then(res => {
      console.log('设备详情数据', res)
      const data = res.data || {}
      this.setData({
        deviceData: data,
        pictures: [...data.pictures || []].map(item => item.pic_url)
      })
      this.getCommentList({
        device_id: id
      })
    })
  },

  goBack() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  // 预览详情大图
  handlePreview(e) {
    const curUrl = e.currentTarget.dataset.item
    wx.previewImage({
      current: curUrl,
      urls: this.data.pictures || [],
    })
  },

  // current 改变时会触发 change 事件
  handleSwiperChange(event) {
    this.setData({
      currentImageIndex: event.detail.current
    })
  },

  // 点击缩略图
  handleClickThum(e) {
    this.setData({
      currentImageIndex: e.currentTarget.dataset.index
    })
  },

  // 原本有图片继续上传
  handleUplaodAfterRead(event) {
    // wx.chooseMedia()
    console.log('handleUplaodAfterRead', event)
  },

  // 查看更多评论
  handleViewMoveComment(e) {
    const deviceId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/comment/index' + `?id=${deviceId}`
    })
  },

  // 去评价
  handleGoComment(e) {
    const deviceId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/comment/index' + `?id=${deviceId}`
    })
  },

  // 去打卡
  handleGoPunchClock(e) {
    const deviceId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/comment/index' + `?id=${deviceId}&showModal=true`
    })
  },

  // 收藏、取消收藏
  handleCollectDevice(e) {
    if (this.data.loadObj.collectLoading) {
      return
    }
    const curDevice = e.currentTarget.dataset.detail
    this.setData({
      loadObj: { ...this.data.loadObj, collectLoading: true }
    })

    apis.collectDevice({
      device_id: curDevice.id,
      type: curDevice.is_collect === 1 ? 2 : 1, // 1-收藏 2-取消
    }).then(res => {
      this.setData({
        deviceData: {
          ...this.data.deviceData,
          is_collect: curDevice.is_collect === 1 ? 0 : 1
        }
      })
    }).finally(() => {
      this.setData({
        loadObj: { ...this.data.loadObj, collectLoading: false }
      })
    })
  },

  // 去纠错
  handleGoCorrection(e) {
    detail = e.currentTarget.dataset.detail

  },

  // 去这里
  handleGoPosition() {
    const deviceData = this.data.deviceData
    if (!deviceData.coordinate) {
      return Toast('当前设备位置信息获取失败');
    }
    wx.openLocation({
      latitude: deviceData.coordinate.split(',')[0] * 1, // 目的地纬度
      longitude: deviceData.coordinate.split(',')[1] * 1, // 目的地经度
      name: deviceData.name, // 目的地名称
      address: deviceData.address, // 目的地地址
    })
  }
})