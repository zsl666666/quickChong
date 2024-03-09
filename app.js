// app.js
import { QQMapWXReverseGeocoder } from './service/QQMapApis'
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.showTabBar()
    const that = this;
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏高度 + 44
    this.globalData.navBarHeight = systemInfo.statusBarHeight + 44;
    this.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    this.globalData.menuTop=  menuButtonInfo.top;
    this.globalData.menuHeight = menuButtonInfo.height;

    // // 当前位置信息
    // QQMapWXReverseGeocoder({
    //   success: function(res) {
    //     console.log('逆地址解析接口-getReverseGeocoder', res, that.globalData)
    //     const result = res.result
    //     const ad_info = result?.ad_info || {}
    //     const params = {
    //       province: ad_info.province,
    //       city: ad_info.city,
    //       district: ad_info.district,
    //       town: result.address_reference?.town?.title || '',
    //       name: result.address_reference.landmark_l2.title,
    //       address: result.formatted_addresses.recommend,
    //       location: result.location,
    //       latitude: result.location.lat,
    //       longitude: result.location.lng,
    //     }
    //     that.globalData.curPositionInfo = params
    //     that.globalData.address = params.city
    //     if (typeof that.asyncOkCb === 'function') {
    //       that.asyncOkCb(that.globalData)
    //     }
    //   }
    // })
  },
  onShow() {
    const that = this;

    if (!this.globalData.address || !this.globalData.curPositionInfo.latitude) {
      console.log('城市位置信息为空，重新获取当前位置相关信息', this.globalData)
      QQMapWXReverseGeocoder({
        success: function(res) {
          console.log('逆地址解析接口-getReverseGeocoder', res, that.globalData)
          const result = res.result
          const ad_info = result?.ad_info || {}
          const params = {
            province: ad_info.province,
            city: ad_info.city,
            district: ad_info.district,
            town: result.address_reference?.town?.title || '',
            name: result.address_reference.landmark_l2.title,
            address: result.formatted_addresses.recommend,
            location: result.location,
            latitude: result.location.lat,
            longitude: result.location.lng,
          }
          that.globalData.curPositionInfo = params
          that.globalData.address = params.city
          that.globalData.userLocationInfo = params
          if (typeof that.asyncOkCb === 'function') {
            that.asyncOkCb(that.globalData)
          }
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    navBarHeight: 0, // 导航栏高度
    menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
    menuTop: 0, // 胶囊距底部间距（保持底部间距一致）
    menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
    address: '', // 城市名
    curPositionInfo: {}, // 位置信息，可通过选择城市修改
    userLocationInfo: {}, // 用户当前所在定位的信息，存储目的是供整个项目直接获取用户定位信息
  }
})
