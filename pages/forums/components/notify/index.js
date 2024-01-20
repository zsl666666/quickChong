// pages/forums/components/notify/index.js
import Toast from '@vant/weapp/toast/toast'
import * as CONFIG from './config'
import apis from './apis'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    ...CONFIG,
    showPopup: false,
    list: [],
    total: 0,
    filterParams: {
      page: 1,
      size: 20,
      type: CONFIG.MESSAGE_TYPE_ALL,  // 顶部选中的消息类型
    },
    isEndPage: false,
    scrollTop: undefined,
  },

  onReady() {

  },
  onLoad() {
    this.handleSearch({ page: 1 })
  },

  // 获取消息列表
  getMessageList(params = {}) {
    apis.getMessageList(params).then(res => {
      const data = res.data || {}
      const list = data.list || []
      let newList = [...list]
      if (params.page !== 1) {
        newList = this.data.list.concat(list).filter((item, index, self) => {
          return self.findIndex(cur => cur.id === item.id) === index
        })
      }


      // 搜索第一页时回到顶部
      if (params.page === 1) {
        this.setData({
          scrollTop: 0
        })
      }

      this.setData({
        list: newList,
        total: data.total,
        isEndPage: list.length !== params.size,
        // isEndPage: list.length !== data.size
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
    this.getMessageList(newParams)
  },

  // 返回上一级
  goBack() {
    // wx.navigateBack({
    //   delta: 1
    // })
    // wx.setStorageSync('isReloadForum', true)
    wx.switchTab({
      url: '/pages/forums/index',
    })
  },

  // 改变消息类型
  handleChangeMeaasgeType() {
    this.setData({
      showPopup: !this.data.showPopup
    })
  },

  // 选中消息类型
  handleSelectedMessageType(e) {
    this.setData({
      filterParams: {
        ...this.data.filterParams,
        type: e.currentTarget.dataset.value
      }
    }, () => {
      this.handleSearch({ page: 1 })
      setTimeout(() => {
        this.setData({
          showPopup: false
        })
      }, 200)
    })
  },

  // 关闭消息类型选择弹窗
  handleClose() {
    this.setData({
      showPopup: false
    })
  },

  // 帖子滚动到底
  handleScrollToLower() {
    const { filterParams, isEndPage } = this.data
    if (!isEndPage) {
      this.handleSearch({
        page: filterParams.page + 1
      })
    }
  },
  // 下拉刷新
  handleScrollRefresh() {
    this.handleSearch({ page: 1 })
    setTimeout(() => {
      this.setData({
        triggered: false
      })
    }, 300)
  },

  // 跳转详情
  goDetail(e) {
    const item = e.currentTarget.dataset.item
    const msg = item.msg || {}
    if (!msg?.post_id) {
      return Toast('帖子已不存在了~')
    }
    wx.navigateTo({
      url: '/pages/forums/components/postDetail/index' + `?postId=${msg.post_id}&isNotifyPage=true`,
    })
  }
})