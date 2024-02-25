// pages/my/components/collectCenter/index.js
import { url } from '../../../../utils/index'
import apis from './apis'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    total: 0,
    filterParams: {
      page: 1,
      size: 20,
      keywords: ''
    },
    isEndPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.handleSearch({ page: 1 })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  onShow() {

  },
  // 获取用户所在位置附近的设备列表
  getDeviceList(params = {}) {
    const currentPosition = JSON.parse(wx.getStorageSync('currentPosition') || '{}')
    apis.getCollectList({
      ...params,
      coordinate: `${currentPosition.latitude},${currentPosition.longitude}`
    }).then(res => {
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
    this.getDeviceList(newParams)
  },

  handleScrollToLower() {
    const { filterParams, isEndPage } = this.data
    console.log('到底啦呀', isEndPage)
    if (!isEndPage) {
      this.handleSearch({
        page: filterParams.page + 1
      })
    }
  },

  handleClick(e) {
    const tempObj = e.currentTarget.dataset.item
    const latitude = tempObj.coordinate.split(',')[0]
    const longitude = tempObj.coordinate.split(',')[1]
    wx.setStorageSync('detailObj', JSON.stringify({
      id: tempObj.id,
      latitude,
      longitude
    }))
    wx.switchTab({
      url: `/pages/index/index?id=${tempObj.id}&&latitude=${latitude}&&longitude=${longitude}`,
    })
  }
})