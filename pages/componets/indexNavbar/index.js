// pages/componets/indexNavbar/index.js
import { areaList } from '@vant/area-data'
import { key } from 'utils/index'
import { getReverseGeocoder } from 'service/QQMapApis'
const app = getApp()
const citySelector = requirePlugin('citySelector')

console.log('选择城市', app.globalData)
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userLocation: {
      type: Object,
      value: {},
      observer: function(val) {
        if (val && val.city) {
          this.setData({
            currentCity: val.city
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    menuRight: app.globalData.menuRight,
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    areaList,
    show: false,
    currentCity: app.globalData?.curPositionInfo?.city || '',
  },

  lifetimes: {
    attached() {
      app.asyncOkCb = (res) => {
        this.setData({
          currentCity: res.curPositionInfo?.city,
        })
      }
    }
  },
  pageLifetimes: {
    show() {
      const city = citySelector.getCity()
  
      const userCity = this.data

      if (city) {
        getReverseGeocoder({
          location: city.location
        }).then(res => {
          const result = res.result
            const ad_info = result?.ad_info || {}
            const params = {
              province: ad_info.province,
              city: ad_info.city,
              district: ad_info.district,
              town: result.address_reference?.town?.title || '',
              name: result.address_reference.landmark_l2.title,
              address: result.formatted_addresses.recommend,
              location: result.location,
              latitude: result.location.lat,
              longitude: result.location.lng,
            }
            app.globalData.curPositionInfo = params
            app.globalData.address = params.city
            this.setData({
              currentCity: params?.city,
            }, () => {
              this.triggerEvent('selectAddress', {
                isUserCity: app.globalData.userLocationInfo.city === params.city
              })
            })
        })
      }

      app.asyncOkCb = (res) => {
        this.setData({
          currentCity: res.curPositionInfo?.city,
        })
      }
    },
    hide() {
      citySelector.clearCity();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchChangeAddress() {
      this.triggerEvent('openRegular', {});
      this.setData({
        show: true
      })
      // console.log(areaList)
    },
    confirm(e) {
      app.globalData.address = e.detail.values[1].name
      this.setData({
        currentCity: e.detail.values[1].name
      })
      this.triggerEvent('selectAddress', {})
      this.onClose()
    },
    onClose() {
      this.setData({
        show: false
      })
    },
    // 切换城市
    handleToggleCity() {
      wx.navigateTo({
        url: `plugin://citySelector/index?key=${key}&referer=满电快搜&hotCitys=${'北京,上海,广州,深圳'}`,
      })
    }
  }
})
