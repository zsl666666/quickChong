// pages/componets/chosenPosition/index.js
import { QQMapWXReverseGeocoder } from '../../../service/QQMapApis'
const initScale = 16
Component({
  options: {
    "styleIsolation": "shared"
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    desc: {
      type: String,
      value: ''
    },
    required: {
      type: Boolean,
      value: false
    },
    initPosData: {
      type: Object,
      value: {},
      observer: function(val) {
        val && this.initPosData(val)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    scale: initScale,
    // latitude: 40.13012,
    // longitude: 116.65477,
    latitude: 0, // 纬度
    longitude: 0, // 经度
    devicePosition: '', // 位置-省市区
    address: '', // 位置-详细地址
    province: '', // 省
    city: '', // 市
    district: '', // 区
    town: '', // 乡镇街道
    myPosition: {}, // 我的位置信息，后面点击回到我的位置直接使用
  },

  observers: {
    'latitude, longitude': function(latitude, longitude) {
      this.handleMapMark({ latitude, longitude })
    },
    // 地图选择位置更新，通知使用者更新数据
    'latitude, longitude, devicePosition, address, province, city, district': function(latitude, longitude, devicePosition, address, province, city, district) {
      this.triggerEvent('mapDataChange', {
        latitude,
        longitude,
        name: devicePosition,
        address,
        province,
        city,
        district
      })
    }
  },

  ready() {
    const { latitude, longitude } = this.data
    this.mapCtx = wx.createMapContext('111101', this)

    if (latitude && longitude) {
      this.handleMapMark({ latitude, longitude })
    } else {
      this.getCurrentLocation()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 逆地址解析，根据经度纬度获取省市区,isMyPos是否是请求我的位置
    getReverseGeocoder(params = {}, isMyPos) {
      const { latitude, longitude } = params
      if (!latitude || !longitude) return
      const that = this
      QQMapWXReverseGeocoder({
        location: {
          latitude,
          longitude
        },
        success: function(res) {
          console.log('逆地址解析接口-getReverseGeocoder', res)
          const result = res.result
          const ad_info = result?.ad_info || {}
          const params = {
            province: ad_info.province,
            city: ad_info.city,
            district: ad_info.district,
            town: result.address_reference?.town?.title || ''
          }
          that.setData({
            ...params,
            ...(isMyPos ? {
              devicePosition: result.address_reference.landmark_l2.title,
              address: result.formatted_addresses.recommend,
              myPosition: { // 保存我的位置信息，后面点击回到我的位置直接使用
                latitude,
                longitude,
                devicePosition: result.address_reference.landmark_l2.title,
                address: result.formatted_addresses.recommend
              }
            } : {})
          })
        }
      })
      // this.triggerEvent('mapDataChange', { latitude, longitude });
    },

    /**
     * 获取当前位置信息
     * @param {Boolean} isClickBackBtn 点击回到当前位置按钮
     */
    getCurrentLocation: function (isClickBackBtn) {
      if (isClickBackBtn) {
        wx.showLoading({
          title: '加载中...',
        })
      }

      wx.getLocation({
        type: 'gcj02',
        isHighAccuracy: true,
        highAccuracyExpireTime: 3500,
        success: (res) => {
          const positionInfo = {
            latitude: res.latitude,
            longitude: res.longitude,
            scale: initScale
          }

          // 更新位置信息
          this.setData(positionInfo, () => {
            // 将地图中心移置当前定位点
            this.mapCtx.moveToLocation(positionInfo)

            // 如果是点击回到我的位置按钮，请求逆地址解析获取我的位置相关信息
            if (isClickBackBtn) {
              if (!this.data.myPosition.latitude) { // 我的位置暂无保存的信息
                // 请求我的位置地址信息
                this.getReverseGeocoder({
                  latitude: positionInfo.latitude,
                  longitude: positionInfo.longitude,
                }, true)
              } else {
                const { devicePosition, address, province, city, district, town } = this.data.myPosition
                this.setData({
                  devicePosition,
                  address,
                  province,
                  city,
                  district,
                  town
                })
              }
            }

          })
        },
        fail: (err) => {
          console.error(err)
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    },

    // 初始化地图位置数据
    initPosData(data) {
      this.setData({
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        city: data.city,
        address: data.address,
        devicePosition: data.name
      })
    },

    // 处理地图标点，移动中心点
    handleMapMark(params = {}) {
      const { latitude, longitude } = params
      if (!this.mapCtx) return
      const markers = [{
        id: 11110101,
        width: 36,
        height: 54,
        latitude: latitude,
        longitude: longitude,
        iconPath: '/image/map/map-marker-icon.png'
      }]

      // 标点
      this.mapCtx.addMarkers({
        markers
      })

      // 地图中心移置当前点
      this.mapCtx.moveToLocation({
        latitude: latitude,
        longitude: longitude,
      })
    },

    // 地图选点
    chooseLocation(params = {}) {
      const data = this.data
      const that = this
      const { latitude = data.latitude, longitude = data.longitude } = params
      wx.chooseLocation({
        latitude,
        longitude,
        success: function(res) {
          console.log("chooseLocation-chooseLocation-chooseLocation", res)
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            devicePosition: res.name,
            address: res.address
          }, () => {
            that.getReverseGeocoder({
              latitude: res.latitude,
              longitude: res.longitude,
            })
          })
        },
        fail: function(err) {
          console.log("errrrrrrrrr", err)
        }
      })
    },

    // 地图拖动
    regionchange(){
      // console.log('regionchange')
    },

    // 地图更新完成
    mapUpdated(e) {
      this.setData({
        scale: initScale
      })
    },

    // 点击地图
    clickMap() {
      this.chooseLocation()
    },

    // 触摸地图
    mapTouchstart() {
      this.chooseLocation()
    },

    // 点击回到当前位置
    onClickIcon() {
      this.getCurrentLocation(true)
    },
    // 位置-省市区输入框聚焦时
    devicePositionFocus() {
      this.chooseLocation()
    }
  }
})