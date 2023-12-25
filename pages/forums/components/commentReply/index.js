// pages/forums/components/commentReply/index.js
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
      value: {}
    }, // 一级评论
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: new Array(20).fill(1).map(item => ({
      id: Math.random() * 100,
      is_collect: false
    }))
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleScrollToLower() {
      console.log('到底啦')
      const list = new Array(20).fill(1).map(item => ({
        id: Math.random() * 100,
        is_collect: false
      }))
      this.setData({
        list: this.data.list.concat(list)
      })
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
    }
  }
})