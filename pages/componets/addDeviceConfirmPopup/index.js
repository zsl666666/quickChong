// pages/componets/addDeviceConfirmPopup/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    title: {
      type: String,
      value: '请确认'
    },
    content: {
      type: String,
      value: ''
    },
    okButtonText: {
      type: String,
      value: '确认'
    },
    cancelButtonText: {
      type: String,
      value: '取消'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    loading: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleCancel() {
      this.setData({
        show: false
      })
    },
    handleSubmit() {
      if (this.data.loading) return

      this.setData({
        loading: true
      })

      this.handleCancel()
      this.triggerEvent('onOk')

      setTimeout(() => {
        this.setData({
          loading: false
        })
      }, 100)
    }
  }
})