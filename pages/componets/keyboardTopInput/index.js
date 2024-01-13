// pages/componets/keyboardTopInput/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: ''
    },
    showInput: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    keyboardHeight: 0, // 键盘高度
    keyboardTopInputMessage: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleKeyboardheightchange(e) {
      this.setData({
        keyboardHeight: e.detail.height,
      })
    },

    //隐藏输入框
    handleBlurInput: function(e) {
      this.setData({
        showInput: false
      })
      this.triggerEvent('onVisible', false)
    },
    handleKeyboardInput(e) {
      const value = e.detail.value
      this.setData({
        keyboardTopInputMessage: value
      })
      this.triggerEvent('onChange', { value })
    },
    handleClickSend() {
      this.triggerEvent('onSubmit')
      // 清空评论输入框
      this.setData({
        keyboardTopInputMessage: ''
      })
    }
  }
})