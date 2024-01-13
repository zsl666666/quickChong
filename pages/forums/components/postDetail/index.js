// pages/forums/components/postDetail/index.js
import * as CONFIG from './config'
import apis from './apis'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ...CONFIG,
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
    detailData: {}, // 帖子详情数据
    replyPopupModal: {
      showReplyPopup: false, // 查看回复弹窗
      data: {}
    }, // 回复弹窗
    commentModal: {
      type: '',
      showInput: false,
    },
    keyboardHeight: 0, // 键盘高度
    keyboardTopInputMessage: '',
    list: [],
    total: 0,
    isEndPage: false,
    filterParams: {
      page: 1,
      size: 20,
      post_id: ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showShareMenu()
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
  onShareTimeline() {

  },

  // 返回上一级
  goBack() {
    // wx.navigateBack({
    //   delta: 1
    // })
    wx.switchTab({
      url: '/pages/forums/index',
    })
  },

  // 获取帖子详情接口
  getDetail(params = {}) {
    apis.getDetail(params).then(res => {
      this.setData({
        detailData: res.data || {}
      })
      this.handleSearch({ page: 1, post_id: params.post_id })
    })
  },
  // 获取评论列表接口
  getCommentList(params = {}) {
    apis.getCommentList(params).then(res => {
      const data = res.data || {}
      const list = data.list || []
      let newList = [...list]
      if (params.page !== 1) {
        newList = this.data.list.concat(list).filter((item, index, self) => {
          return self.findIndex(cur => cur.id === item.id) === index
        })
      }

      this.setData({
        list: newList,
        total: data.total,
        isEndPage: list.length !== params.size,
      })
    })
  },
  // 评论接口
  postCommentReply(params = {}) {
    apis.postCommentReply(params).then(res => {
      this.handleSearch({ page: 1 })

      // 设置帖子评论数+1
      this.setData({
        detailData: {
          ...this.data.detailData,
          comment_number: this.data.detailData.comment_number + 1
        }
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
    this.getCommentList(newParams)
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
  handleViewReply(e) {
    this.setData({
      replyPopupModal: {
        showReplyPopup: true,
        data: e.currentTarget.dataset.item
      }
    })
  },
  // 关闭回复弹窗
  handlePopupClose() {
    this.setData({
      replyPopupModal: {
        showReplyPopup: false,
        data: {}
      }
    })
  },
  // 回复成功回调
  handleReplyOk(e) {
    const { cid, post_id } = e.detail
    const { list, detailData } = this.data
    const targetIndex = list.findIndex(item => item.id === cid)
    const newList = [...list]
    if (targetIndex !== -1) {
      newList[targetIndex].reply_number = newList[targetIndex].reply_number + 1
      this.setData({
        list: newList,
        detailData: {
          ...detailData,
          comment_number: detailData.comment_number + 1
        }
      })
    }
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
    const { filterParams, isEndPage } = this.data
    if (!isEndPage) {
      this.handleSearch({
        page: filterParams.page + 1
      })
    }
  },

  // 点击帖子评论
  handleShowInput: function() {
    this.setData({
      commentModal: {
        type: CONFIG.COMMENT_TYPE_POST,
        showInput: true
      }
    })
  },

  handleKeyboardInput(e) {
    this.setData({
      keyboardTopInputMessage: e.detail.value
    })
  },

  handleKeyboardTopInputVisible(e) {
    const visible = e.detail
    this.setData({
      commentModal: {
        ...this.data.commentModal,
        showInput: false
      }
    })
  },

  // 点击一级评论
  handleComment(e) {
    this.setData({
      commentModal: {
        type: CONFIG.COMMENT_TYPE_COMMENT,
        showInput: true,
        data: e.currentTarget.dataset.item
      }
    })
  },

  // 提交评论
  handleSubmit() {
    console.log('发送啦', this.data.keyboardTopInputMessage)
    const { postId, keyboardTopInputMessage, commentModal } = this.data
    const params = {
      post_id: postId,
      content: keyboardTopInputMessage
    }
    // 对评论进行评论
    if (commentModal.type === CONFIG.COMMENT_TYPE_COMMENT) {
      params.cid = commentModal.data.id
    }
    this.postCommentReply(params)
    // 清空保存的评论输入框值
    this.setData({
      keyboardTopInputMessage: ''
    })
  }
})