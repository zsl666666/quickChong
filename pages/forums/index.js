// pages/forums/index.js
import { verifyLogin } from 'utils/index'
import apis from './apis'

const app = getApp()

// 轮询未读消息数
let timer = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    searchBoxHeight: 0,
    triggered: false,
    // serachValue: '', // 搜索框值
    list: [],
    total: 0,
    filterParams: {
      page: 1,
      size: 20,
      keywords: ''
    },
    isEndPage: false,
    scrollTop: undefined,
    showLogin: false,
    unReadNum: 0,
    isViewPage: wx.getStorageSync('isView')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log('生命周期函数--监听页面加载', options)
  },

  // 点击tabar回调
  onTabItemTap: function (item) {
    this.handleSearch({ page: 1 })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.createSelectorQuery().select('.forums-search-wrap').boundingClientRect(rect=>{
      this.setData({
        searchBoxHeight: rect?.height
      })
    }).exec();
    this.handleSearch({ page: 1 })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      isViewPage: wx.getStorageSync('isView')
    })

    // 判断是否登录状态
    const loginStatus = verifyLogin()
    // 登录获取未读消息数
    if (loginStatus) {
      this.getUnReadMessage()
    }

    // 发帖完成跳转过来得
    const isReloadForum = wx.getStorageSync('isReloadForum')
    if (isReloadForum || !this.data.list.length) {
      wx.removeStorageSync('isReloadForum')
      this.handleSearch({ page: 1 })
    }

    // 帖子详情点击话题跳转过来的
    const  topic = wx.getStorageSync('topic')
    if (topic) {
      wx.removeStorageSync('topic')
      this.handleSearch({ page: 1, keywords: topic })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    clearTimeout(timer)
    timer = null
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

  // 获取论坛帖子列表
  getForumList(params = {}) {
    apis.getForumList(params).then(res => {
      const data = res.data || {}
      const list = data.list || []
      let newList = [...list]
      if (params.page !== 1) {
        newList = this.data.list.concat(list).filter((item, index, self) => {
          return self.findIndex(cur => cur.id === item.id) === index
        })
      }


      // 搜索第一页时回到顶部
      if (params.page === 1) {
        this.setData({
          scrollTop: 0
        })
      }

      this.setData({
        list: newList,
        total: data.total,
        isEndPage: list.length !== params.size,
        // isEndPage: list.length !== data.size
      })
    })
  },

  // 查询列表
  handleSearch(params = {}) {
    const newParams = {
      ...this.data.filterParams,
      ...params
    }
    this.setData({
      filterParams: newParams
    })
    this.getForumList(newParams)
  },

  // 跳转帖子详情
  goPostDetail(e) {
    const data = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/forums/components/postDetail/index' + `?postId=${data.id}`,
    })
  },

  // 跳转消息通知
  goNotify() {
    if (!verifyLogin()) {
      return this.notLoginFn()
    }
    wx.navigateTo({
      url: '/pages/forums/components/notify/index',
    })
  },

  // 跳转发帖页面
  goPostMessage() {
    if (!verifyLogin()) {
      return this.notLoginFn()
    }
    wx.navigateTo({
      url: '/pages/forums/components/postMessage/index',
    })
  },

  // 帖子滚动到底
  handleScrollToLower() {
    const { filterParams, isEndPage } = this.data
    if (!isEndPage) {
      this.handleSearch({
        page: filterParams.page + 1
      })
    }
  },

  // 下拉刷新
  handleScrollRefresh() {
    this.handleSearch({ page: 1 })
    setTimeout(() => {
      this.setData({
        triggered: false
      })
    }, 300)
  },

  // 帖子搜索框改变事件
  handleForumChange(e) {
    this.setData({
      // serachValue: e.detail
      filterParams: {
        ...this.data.filterParams,
        keywords: e.detail
      }
    })
  },

  // 搜索
  handleForumSearch(e) {
    const value = e.detail
    this.handleSearch({
      page: 1,
      keywords: value
    })
  },

  // 清空搜索框
  handleClearCancel() {
    // this.setData({
    //   serachValue: ''
    // })
    this.handleSearch({
      page: 1,
      keywords: ''
    })
  },

  // 发帖人头像加载失败
  handleAvatarImageError(e) {
    const id = e.currentTarget.dataset.id
    const newList = [...this.data.list]
    const index = newList.findIndex(item => item.id === id)
    if (index !== -1) {
      newList[index].avatar = '/image/no-login.png'
    }
    this.setData({
      list: newList
    })
  },

  // 未登录回调
  notLoginFn() {
    this.setData({
      showLogin: true
    })
  },

  // 登录成功
  loginSureHandle(){
    setTimeout(() => {
      this.setData({
        showLogin: false
      })
    }, 500)
  },

  // 获取未读消息
  getUnReadMessage() {
    apis.getUnReadMessage().then(res => {
      const num = res.data?.num || 0
      this.setData({
        unReadNum: num
      })
      clearTimeout(timer)
      if (!num) {
        timer = setTimeout(() => {
          this.getUnReadMessage()
        }, 10000)
      }
    })
  }
})