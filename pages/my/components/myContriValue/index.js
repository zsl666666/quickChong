// pages/my/components/myContriValue/index.js
import * as CONFIG from './config'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ...CONFIG,
    contributeType: CONFIG.CONTRIBUTE_TYPE_ADD, // 贡献值类型
    contributeExplainPopup: false, // 贡献说明弹窗
    filterType: CONFIG.APPROVE_STATUS_ALL, // 筛选贡献值类型
  },

  onReady: function() {
    // 生命周期函数 onReady 中获取自定义的 popover 组件，根据id获取
    this.popover = this.selectComponent('#popover');
  },

  // 贡献类型改变
  handleContributeTypeChange(e) {
    this.setData({
      contributeType: e.currentTarget.dataset.item.value
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
    this.setData({
      filterType: e.currentTarget.dataset.value
    }, () => {
      setTimeout(() => {
        // 调用自定义组件 popover 中的 onHide 方法
        this.popover.onHide();
      }, 300)
    })
  },

  // 查看驳回原因
  handleViewReject() {
    console.log('查看拒绝原因')
  },

  //跳转添加详情回显
  goAddDetail() {
    console.log('点击跳转添加设备详情回显')
  },

  // 跳转纠错详情回显
  goCorrectDetail() {
    console.log('点击跳转纠错详情回显')
  },

  handleScrollToLower() {
    console.log('贡献值列表到底')
  }
})