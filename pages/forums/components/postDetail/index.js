// pages/forums/components/postDetail/index.js
import apis from './apis'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    postId: undefined, // 帖子id
    postImages: [
      "https://gathertrack.oss-cn-beijing.aliyuncs.com/2023/11/XuxagZGpWCoSsV1b8qrUAcIPimtFlNBM.jpg",
      "https://gathertrack.oss-cn-beijing.aliyuncs.com/2023/11/qWsLBzkIxT1oVRY5HXUdGj3cOQ9Z4PF7.jpg",
      "https://gathertrack.oss-cn-beijing.aliyuncs.com/2023/11/YHQSrWp9GNFb6Asef7CXV4agO3jdMyBc.jpg",
      "https://gathertrack.oss-cn-beijing.aliyuncs.com/2023/11/A5xnqM97CFw3f1TYOHez2rsUaV0NXjdu.jpg"
    ],
    commentList: [
      {
        id: 1,
        is_collect: true
      },
      {
        id: 2,
        is_collect: false
      },
      {
        id: 3,
        is_collect: false
      },
      {
        id: 4,
        is_collect: false
      }
    ],
    showReplyPopup: false, // 查看回复弹窗
    detailData: {}, // 帖子详情数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('options', options)
    const id = options?.postId
    this.setData({
      postId: id
    })
    this.getDetail({ post_id: id })
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

  // 返回上一级
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },

  // 获取帖子详情接口
  getDetail(params = {}) {
    apis.getDetail(params).then(res => {
      this.setData({
        detailData: res.data || {}
      })
    })
  },

  // 预览帖子详情大图
  handlePreview(e) {
    const curUrl = e.currentTarget.dataset.item
    wx.previewImage({
      current: curUrl,
      urls: this.data.detailData.pictures || [],
    })
  },

  // 点击查看回复
  handleViewReply() {
    this.setData({
      showReplyPopup: true
    })
  },
  handlePopupClose() {
    this.setData({
      showReplyPopup: false
    })
  },
  // 处理收藏、取消收藏
  handleCollect(e) {
    const data = e.currentTarget.dataset.item
    const newList = this.data.commentList.map(item => {
      const newItem = {...item}
      if (newItem.id === data.id) {
        newItem.is_collect = !newItem.is_collect
      }
      return newItem
    })
    this.setData({
      commentList: newList
    })
  },

  // 滑到底了
  handleScrollToLower() {
    console.log('到底啦帅哥')
    const list = new Array(20).fill({
      id: Math.random() * 100,
      is_collect: false
    })
    this.setData({
      commentList: this.data.commentList.concat(list)
    })
  }
})