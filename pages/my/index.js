// pages/my/index.js
import { url } from '../../utils/util'
import { verifyLogin } from 'utils/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifLogin: verifyLogin(),
    userData: {},
    avatarUrl: wx.getStorageSync('avatarUrl'),
    nickName: wx.getStorageSync('nickName'),
    showLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      ifLogin: verifyLogin(),
      avatarUrl: wx.getStorageSync('avatarUrl'),
      nickName: wx.getStorageSync('nickName')
    })
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
    this.setData({
      ifLogin: verifyLogin(),
      avatarUrl: wx.getStorageSync('avatarUrl'),
      nickName: wx.getStorageSync('nickName')
    })
    wx.request({
      url: url + '/api/user/profile',
      method: 'GET',
      data: {
        ticket: wx.getStorageSync('ticket')
      },
      success: (res) => {
        console.log(res)
        this.setData({
          userData: res.data.data
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  // 获取微信授权
  getUserInfoHanle () {
    if (!wx.getStorageSync('nickName')) {
      this.setData({
        showLogin: true
      })
    }
  },

  loginSureHandle(){
    setTimeout(() => {
      this.setData({
        avatarUrl: wx.getStorageSync('avatarUrl'),
        nickName: wx.getStorageSync('nickName'),
        showLogin: false,
        ifLogin: verifyLogin()
      })
    }, 500)
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

  // 帮助中心
  goHelpCenter() {
    wx.navigateTo({
      url: '/pages/help/index',
    })
  },

  // 意见反馈
  feedback() {
    if (!wx.getStorageSync('nickName')) {
      this.getUserInfoHanle()
    } else {
      wx.navigateTo({
        url: '/pages/feedback/index',
      })
    }
  },

  // 我要合作
  cooperateHandle() {
    if (!wx.getStorageSync('nickName')) {
      this.getUserInfoHanle()
    } else {
      wx.navigateTo({
        url: '/pages/cooperate/index',
      })
    }
  },

  contributeHandle() {
    wx.navigateTo({
      url: '/pages/contribute/index',
    })
  },

  // 跳转我的贡献值
  goMyContributeValue() {
    if (!this.data.ifLogin) {
      return this.setData({
        showLogin: true
      })
    }
    wx.navigateTo({
      url: '/pages/my/components/myContriValue/index' + `?userData=${encodeURIComponent(JSON.stringify(this.data.userData))}`,
    })
  },

  // 跳转收藏中心
  goCollectCenter() {
    if (!this.data.ifLogin) {
      return this.setData({
        showLogin: true
      })
    }

    wx.navigateTo({
      url: '/pages/my/components/collectCenter/index',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})