// pages/forums/components/commentReply/index.js
import { verifyLogin } from 'utils/index'
import apis from './apis'
import * as CONFIG from '../postDetail/config'

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    showPopup: {
      type: Boolean,
      value: false
    },
    levelCommentDetail: {
      type: Object,
      value: {},
      observer: function(obj) {
        if (obj.id && obj.post_id) {
          this.handleSearch({
            page: 1,
            cid: obj.id,
            post_id: obj.post_id,
          })
        }
      }
    }, // 一级评论
    // 帖子文章详情
    articleDetail: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    CONFIG,
    list: [],
    total: 0,
    isEndPage: false,
    filterParams: {
      page: 1,
      size: 20,
      cid: '',
      post_id: ''
    },
    commentModal: {
      type: '',
      showInput: false,
    },
    keyboardHeight: 0, // 键盘高度
    keyboardTopInputMessage: '',
    showLogin: false, // 是否显示登录弹窗
  },

  /**
   * 组件的方法列表
   */
  methods: {
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

    // 评论接口
    postCommentReply(params = {}, option = {}) {
      const { type } = option
      apis.postCommentReply(params).then(res => {
        this.handleSearch({ page: 1 })
        this.triggerEvent('onReplyOk', { cid: params.cid, post_id: params.post_id })
        // 设置帖子评论数+1
        // this.setData({
        //   detailData: {
        //     ...this.data.detailData,
        //     comment_number: this.data.detailData.comment_number + 1
        //   }
        // })
      })
    },
    // 获取评论回复列表接口
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
    /**
     * 评论，回复点赞接口
     * @param {*} params 
     * @param {*} isCommentLike 是否对顶部一级评论点赞，true是，false是回复点赞
     */
    postCommentReplyLike(params = {}, isCommentLike) {
      apis.postCommentReplyLike(params).then(res => {
        // 对顶部评论点赞
        if (isCommentLike) {
          this.triggerEvent('onLevelCommentLike', {
            ...params
          })
        } else { // 对评论回复点赞
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
    handleScrollToLower() {
      const { filterParams, isEndPage } = this.data
      if (!isEndPage) {
        this.handleSearch({
          page: filterParams.page + 1
        })
      }
    },
  
    // 关闭回复弹窗
    handleClose() {
      this.triggerEvent('onClose')
    },
  
    // 处理收藏、取消收藏
    handleReplyLike(e) {
      if (!verifyLogin()) {
        return this.notLoginFn()
      }

      const data = e.currentTarget.dataset.item
      this.postCommentReplyLike({
        like_id: data.id,
        type: data.is_like === 1 ? 2 : 1,
      })
    },
  
    // 评论点赞
    handleCommentLike(e) {
      if (!verifyLogin()) {
        return this.notLoginFn()
      }

      const data = e.currentTarget.dataset.item
      this.postCommentReplyLike({
        like_id: data.id,
        type: data.is_like === 1 ? 2 : 1,
      }, true)
    },

    handleCommentReply(e) {
      if (!verifyLogin()) {
        return this.notLoginFn()
      }
      const detail = e.currentTarget.dataset
      this.setData({
        commentModal: {
          type: detail.type,
          showInput: true,
          data: detail.item
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
      // 提交评论
  handleSubmit() {
    const { filterParams, keyboardTopInputMessage, commentModal } = this.data
    const params = {
      // post_id: postId,
      post_id: filterParams.post_id,
      cid: filterParams.cid,
      content: keyboardTopInputMessage
    }
    // 对回复进行回复
    if (commentModal.type === CONFIG.COMMENT_TYPE_REPLY) {
      params.rid = commentModal.data.id
    }
    this.postCommentReply(params, { type: commentModal.type })
    // 清空保存的评论输入框值
    this.setData({
      keyboardTopInputMessage: ''
    })
  }
  },
})