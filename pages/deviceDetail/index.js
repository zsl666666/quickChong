// pages/deviceDetail/index.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    // 设备图片
    pictures: ['https://gathertrack.oss-cn-beijing.aliyuncs.com/2024/03/JvRXkeKU1jr0bO9o2ZfMTQCcxqyIhBPS.jpg?x-oss-process=image/resize,w_200,h_160', 'https://gathertrack.oss-cn-beijing.aliyuncs.com/2024/03/TtojLp9vQ3cM17miEydAWkGxZqKNwVIl.jpg?x-oss-process=image/resize,w_200,h_160', 'https://gathertrack.oss-cn-beijing.aliyuncs.com/2024/03/C4OwPZe9J5yND6pTIndaLkrjsuU8AmWg.png?x-oss-process=image/resize,w_200,h_160'],
    currentImageIndex: 0, // 当前swiper所在滑块的 index
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

  handleTransition(e) {
    // console.log('fffsfdsfsfs', e)
  }
})