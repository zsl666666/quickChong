// pages/forums/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchBoxHeight: 0,
    triggered: false,
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
    wx.createSelectorQuery().select('.forums-search-wrap').boundingClientRect(rect=>{
      this.setData({
        searchBoxHeight: rect.height
      })
    }).exec();
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

  // 跳转帖子详情
  goPostDetail(e) {
    const data = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/forums/components/postDetail/index' + `?postId=${2}`,
    })
  },

  // 跳转消息通知
  goNotify() {
    wx.navigateTo({
      url: '/pages/forums/components/notify/index',
    })
  },

  // 帖子滚动到底
  handleScrollToLower() {
    console.log('到底啦呀')
  },

  // 下拉刷新
  handleScrollRefresh() {
    setTimeout(() => {
      this.setData({
        triggered: false
      })
    }, 500)
  }
})