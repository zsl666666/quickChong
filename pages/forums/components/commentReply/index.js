// pages/forums/components/commentReply/index.js
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
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
      console.log('到底啦')
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
    handleCollect(e) {
      const data = e.currentTarget.dataset.item
      const newList = this.data.list.map(item => {
        const newItem = {...item}
        if (newItem.id === data.id) {
          newItem.is_collect = !newItem.is_collect
        }
        return newItem
      })
      this.setData({
        list: newList
      })
    },

    handleCommentReply(e) {
      console.log('----', e.currentTarget)
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
    console.log('发送啦', this.data.keyboardTopInputMessage)
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