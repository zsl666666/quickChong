// pages/forums/components/notify/index.js
import * as CONFIG from './config'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    ...CONFIG,
    topMessageType: CONFIG.MESSAGE_TYPE_ALL, // 顶部选中的消息类型
    showPopup: false
  },
  // 返回上一级
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },

  // 改变消息类型
  handleChangeMeaasgeType() {
    this.setData({
      showPopup: !this.data.showPopup
    })
  },

  // 选中消息类型
  handleSelectedMessageType(e) {
    this.setData({
      topMessageType: e.currentTarget.dataset.value
    }, () => {
      setTimeout(() => {
        this.setData({
          showPopup: false
        })
      }, 200)
    })
  },

  // 关闭消息类型选择弹窗
  handleClose() {
    this.setData({
      showPopup: false
    })
  }
})