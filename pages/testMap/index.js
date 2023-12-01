// pages/testMap/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 40.13012,
    longitude: 116.65477,
    markers: [{
      id: 132934,
      height: "20px",
      width: "20px",
      // iconPath: "/image/chongdiangzhuang-map-icon.png",
      latitude: 40.13012,
      longitude: 116.65477
    }]
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

  regionchange(e) {
    console.log('gggdf', e)
      this.mapCtx = wx.createMapContext('mapPoint')
      this.mapCtx.getCenterLocation({
        success: (res) => {
          // 设置当前的地图中心坐标为用户坐标
          wx.setStorageSync('currentPosition', JSON.stringify({ latitude: res.latitude, longitude: res.longitude }))
          console.log('map-地图中心点坐标', res.latitude, res.longitude)
          const firstMarker = this.data.markers[0]
          const newMarkers = [{
            ...firstMarker,
            latitude: res.latitude,
            longitude: res.longitude,
          }]
          this.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            markers: newMarkers
          })
        },
        fail: (err) => {
          console.error('获取中心坐标失败', err)
        }
      })
  }
})