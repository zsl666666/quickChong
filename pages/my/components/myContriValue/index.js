// pages/my/components/myContriValue/index.js
import apis, { getCommentList, getCorrectList } from './apis'
import * as CONFIG from './config'
import Dialog from '@vant/weapp/dialog/dialog'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ...CONFIG,
    contributeType: CONFIG.CONTRIBUTE_TYPE_ADD, // 贡献值类型
    contributeExplainPopup: false, // 贡献说明弹窗
    filterType: CONFIG.APPROVE_STATUS_ALL, // 筛选贡献值类型
    contributeValueData: {}, // 贡献值数据
    list: [],
    total: 0,
    filterParams: {
      page: 1,
      size: 20,
    },
    isEndPage: false,
  },

  onReady: function() {
    // 生命周期函数 onReady 中获取自定义的 popover 组件，根据id获取
    this.popover = this.selectComponent('#popover');
    this.handleSearch({ page: 1 })
  },

  onLoad(options) {
    const params = JSON.parse(decodeURIComponent(options.userData) || '{}')
    this.setData({
      contributeValueData: params
    })
  },

  // 我添加的设备列表接口, check_status 0-待审核 1-通过 2-驳回
  getAddDeviceList(params = {}) {
    apis.getAddDeviceList({
      ...params,
      ...([CONFIG.APPROVE_STATUS_PASS, CONFIG.APPROVE_STATUS_DOING, CONFIG.APPROVE_STATUS_REJECT].includes(this.data.filterType) ? {
        check_status: this.data.filterType
      } : {})
    }).then(res => {
      const data = res.data || {}
      const list = data.list || []
      let newList = [...list]
      if (params.page !== 1) {
        newList = this.data.list.concat(list)
      }

      this.setData({
        list: newList,
        total: data.total,
        // isEndPage: list.length !== params.size,
        isEndPage: list.length !== data.size
      })
    })
  },

  // 获取我纠错的设备列表接口
  getCorrectList(params = {}) {
    apis.getCorrectList({
      ...params,
      ...([CONFIG.APPROVE_STATUS_PASS, CONFIG.APPROVE_STATUS_DOING, CONFIG.APPROVE_STATUS_REJECT].includes(this.data.filterType) ? {
        check_status: this.data.filterType
      } : {})
    }).then(res => {
      const data = res.data || {}
      const list = data.list || []
      let newList = [...list]
      if (params.page !== 1) {
        newList = this.data.list.concat(list)
      }

      this.setData({
        list: newList,
        total: data.total,
        isEndPage: list.length !== params.size,
        // isEndPage: list.length !== data.size
      })
    })
  },

  // 获取我评论的设备列表接口
  getCommentList(params = {}) {
    apis.getCommentList(params).then(res => {
      const data = res.data || {}
      const list = data.list || []
      let newList = [...list]
      if (params.page !== 1) {
        newList = this.data.list.concat(list)
      }

      this.setData({
        list: newList,
        total: data.total,
        isEndPage: list.length !== params.size,
        // isEndPage: list.length !== data.size
      })
    })
  },

  handleSearch(params = {}) {
    const typeMap = {
      [CONFIG.CONTRIBUTE_TYPE_ADD]: this.getAddDeviceList,
      [CONFIG.CONTRIBUTE_TYPE_CORRECTION]: this.getCorrectList,
      [CONFIG.CONTRIBUTE_TYPE_COMMENT]: this.getCommentList
    }
    const fn = typeMap[this.data.contributeType]
    const newParams = {
      ...this.data.filterParams,
      ...params
    }
    this.setData({
      filterParams: newParams
    })
    if (fn) {
      fn(newParams)
    }
  },

  // 贡献类型改变
  handleContributeTypeChange(e) {
    this.setData({
      list: [],
      total: 0,
      contributeType: e.currentTarget.dataset.item.value
    }, () => {
      this.handleSearch({ page: 1 })
    })
  },

  // 弹出贡献值说明弹窗
  onContributeExplainPopup() {
    this.setData({
      contributeExplainPopup: true
    })
  },
  // 关闭贡献值说明弹窗
  onContributeExplainClose() {
    this.setData({ contributeExplainPopup: false });
  },

  bindTap(e) {
    if (e.target.dataset.ignoreClick !== "true") {  
      this.popover?.onHide()
    }
  },

  // 点击筛选贡献类型
  onFilterContrbuteType: function (e) {
    // 获取按钮元素的坐标信息
    wx.createSelectorQuery().select('#button').boundingClientRect(res => {
      // 调用自定义组件 popover 中的 onDisplay 方法
      this.popover?.onDisplay(res);
    }).exec();
  },
  // 响应popover组件中的子元素点击事件
  onPopoverItem: function (e) {
    const value = e.currentTarget.dataset.value
    if (value === this.data.filterType) {
      setTimeout(() => {
        // 调用自定义组件 popover 中的 onHide 方法
        this.popover.onHide();
      }, 300)
      return
    }

    this.setData({
      filterType: value
    }, () => {
      this.handleSearch({ page: 1 })
      setTimeout(() => {
        // 调用自定义组件 popover 中的 onHide 方法
        this.popover.onHide();
      }, 300)
    })
  },

  // 查看驳回原因
  handleViewReject(e) {
    const data = e.currentTarget.dataset.item
    if (data.status !== CONFIG.APPROVE_STATUS_REJECT) return

    Dialog.alert({
      theme: 'round-button',
      title: '驳回原因',
      message: data.reject_msg || '暂无原因',
      confirmButtonText: '我知道啦',
      closeOnClickOverlay: true
    })
  },

  //跳转添加详情回显
  goAddDetail() {
    console.log('点击跳转添加设备详情回显')
  },

  // 跳转纠错详情回显
  goCorrectDetail(e) {
    const data = e.currentTarget.dataset.item
    // apis.getDeviceDetail({
    //   id: data.device_id,
    //   coordinate: data.coordinate
    // }).then(res => {
    //   const resResponse = {
    //     ...(res.data || {}),
    //     error_type: data.error_type
    //   }
    //   wx.navigateTo({
    //     url: `/pages/errorCorrection/index?id=${data.device_id}&type=view&detail=${encodeURIComponent(JSON.stringify(resResponse))}`,
    //   })
    // }).catch(err => {
    //   return wx.showToast({
    //     title: err.data.msg || '获取设备信息失败',
    //     icon: 'error',
    //   })    
    // })

    wx.navigateTo({
      url: `/pages/errorCorrection/index?id=${data.device_id}&type=view&detail=${encodeURIComponent(JSON.stringify(data))}`,
    })
  },

  handleScrollToLower() {
    console.log('贡献值列表到底')
    const { filterParams, isEndPage } = this.data
    if (!isEndPage) {
      this.handleSearch({
        page: filterParams.page + 1
      })
    }
  }
})