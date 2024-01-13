// pages/forums/index.js
import apis from './apis'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchBoxHeight: 0,
    triggered: false,
    serachValue: '', // 搜索框值
    list: [],
    total: 0,
    filterParams: {
      page: 1,
      size: 20,
      keywords: ''
    },
    isEndPage: false,
    scrollTop: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('生命周期函数--监听页面加载', options)
  },

  // 点击tabar回调
  onTabItemTap: function (item) {
    console.log('tabBar', item)
    this.handleSearch({ page: 1 })
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
    this.handleSearch({ page: 1 })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const isPostOk = wx.getStorageSync('isPostOk')
    if (isPostOk) {
      wx.removeStorageSync('isPostOk')
      this.handleSearch({ page: 1 })
    }
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
    wx.navigateTo({
      url: '/pages/forums/components/notify/index',
    })
  },

  // 跳转发帖页面
  goPostMessage() {
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
      serachValue: e.detail
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
    this.setData({
      serachValue: ''
    })
    this.handleSearch({
      page: 1,
      keywords: ''
    })
  }
})