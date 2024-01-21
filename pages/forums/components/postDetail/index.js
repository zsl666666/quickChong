// pages/forums/components/postDetail/index.js
import { verifyLogin } from 'utils/index'
import Dialog from '@vant/weapp/dialog/dialog'
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
    isNotifyPage: false, // 是否消息通知页面跳转过来的
    showLogin: false, // 是否显示登录弹窗
  },

  handleLinktap(e) {
    const  value = e.detail.innerText
    wx.setStorageSync('topic', value)
    wx.switchTab({
      url: '/pages/forums/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showShareMenu()
    const id = options?.postId
    this.setData({
      postId: id,
      isNotifyPage: options.isNotifyPage === 'true'
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

    // 是消息通知过来的
    if (this.data.isNotifyPage) {
      wx.navigateTo({
        url: '/pages/forums/components/notify/index',
      })
    } else {
      wx.switchTab({
        url: '/pages/forums/index',
      })
    }
  },

  // 获取帖子详情接口
  getDetail(params = {}) {
    apis.getDetail(params).then(res => {
      const data = res.data || {}

      let newContent = data.content
      const brStr = newContent.replace(/\r\n/g, '<br />')
      newContent = brStr.replace(/[#＃][^#＃]+[#＃]/g, '<a style="color: #0874b9">$&</a>')

      data.topicContent = newContent

      this.setData({
        detailData: data
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

  // 帖子点赞接口
  postLike(params = {}) {
    apis.postLike(params).then(res => {
      const { detailData } = this.data
      this.setData({
        detailData: {
          ...detailData,
          like_number: params.type === 1 ? detailData.like_number + 1 : detailData.like_number - 1,
          is_like: params.type === 1 ? 1 : 0
        }
      })
    })
  },

  // 评论，回复点赞接口
  postCommentReplyLike(params = {}) {
    apis.postCommentReplyLike(params).then(res => {
      const { list } = this.data
      const newList = [...list]
      const index = newList.findIndex(item => item.id === params.like_id)
      if (index !== -1) {
        const targetItem = newList[index]
        newList[index].like_number = params.type === 1 ? targetItem.like_number + 1 : targetItem.like_number - 1
        newList[index].is_like = params.type === 1 ? 1 : 0
        this.setData({
          list: newList
        })
      }
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

  // 登录成功
  loginSureHandle(){
    setTimeout(() => {
      this.setData({
        showLogin: false
      })
    }, 500)
  },

  // 未登录回调
  notLoginFn() {
    this.setData({
      showLogin: true
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
    if (!verifyLogin()) {
      return this.notLoginFn()
    }

    const data = e.currentTarget.dataset.item
    this.postCommentReplyLike({
      like_id: data.id,
      type: data.is_like === 1 ? 2 : 1,
    })
  },

  // 点击帖子点赞
  handleGivePostLike() {
    if (!verifyLogin()) {
      return this.notLoginFn()
    }

    const { detailData } = this.data
    this.postLike({
      like_id: detailData.id,
      type: detailData.is_like === 1 ? 2 : 1,
    })
  },

  // 一级评论点赞回调（回复组件透传）
  handleLevelCommentLike(e) {
    const { like_id, type } = e.detail
    const { list, replyPopupModal } = this.data
    const newList = [...list]
    const index = newList.findIndex(item => item.id === like_id)
    if (index !== -1) {
      const targetItem = newList[index]
      newList[index].like_number = type === 1 ? targetItem.like_number + 1 : targetItem.like_number - 1
      newList[index].is_like = type === 1 ? 1 : 0
      this.setData({
        list: newList,
        replyPopupModal: {
          ...replyPopupModal,
          data: {
            ...replyPopupModal.data,
            like_number: type === 1 ? replyPopupModal.data.like_number + 1 : replyPopupModal.data.like_number - 1,
            is_like: type === 1 ? 1 : 0
          }
        }
      })
    }
  },

  // 滑到底了
  handleScrollToLower() {
    const { filterParams, isEndPage } = this.data
    if (!isEndPage) {
      this.handleSearch({
        page: filterParams.page + 1
      })
    }
  },

  // 点击帖子评论
  handleShowInput: function() {
    if (!verifyLogin()) {
      return this.notLoginFn()
    }

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
    if (!verifyLogin()) {
      return this.notLoginFn()
    }

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
  },

  // 删除
  handleDetale() {
    if (!verifyLogin()) {
      return this.notLoginFn()
    }
    Dialog.confirm({
      message: '确认删除该帖子么？删除后无法恢复!',
      confirmButtonText: '确定',
      cancelButtonText: '我再想想'
    }).then(() => {
      // on close
      apis.postDelete({ id: this.data.detailData.id }).then(res => {
        wx.setStorageSync('isReloadForum', true)
        wx.switchTab({
          url: '/pages/forums/index',
        })
      })
    })
  }
})