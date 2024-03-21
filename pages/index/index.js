// index.js
import { url, getUserInfo, QQMapWX } from '../../utils/util'
import Toast from '@vant/weapp/toast/toast';
import apis from './apis'
import { getReverseGeocoder } from 'service/QQMapApis'

// 获取应用实例
const app = getApp()
let timeId = 0
let commonMarkId = 0
let detailLatiuteAndLongitude = {
  latitude: 0,
  longitude: 0
}
const mapIcon = {
  '充电桩': '/image/chongdiangzhuang-map-icon.png',
  '换电柜': '/image/huandiangui-map-icon.png',
  '充电柜': '/image/chongdiangui-map-icon.png'
}
const selectMapIcon = {
  '充电桩': '/image/dianzhuang-xuan.png',
  '换电柜': '/image/huandiangui-xuan.png',
  '充电柜': '/image/diangui-xuan.png'
}

// 是否是预览图片，为了解决预览图片触发onHide的问题
let isViewImg = false


const initNoticeBarText = '请您注意骑行安全，远离大车盲区，减速慢行注意避让；请您注意消防安全，禁止电动车及电池室内停放或充电。'

Page({
  data: {
    navBarHeight: app.globalData.navBarHeight,
    isNoticeBar: false, // 顶部通知
    isNoticeScrollable: false, // 顶部通知是否支持滚动
    noticeBarText: initNoticeBarText, // 顶部通知的内容
    visibleCenterLocationAdd: false, // 地图中心点位置添加按钮是否可见
    visibleAddDeviceGift: true, // 是否展示添加设备兑换礼品弹窗
    chargeBtnArray: [{
      name: '全部',
      id: 1,
      selectIcon: '',
      icon: '',
      value: ''
    }, {
      name: '充电桩',
      selectIcon: '/image/chongdianzhuang-select-icon.png',
      icon: '/image/chongdianzhuang-icon.png',
      id: 2,
      value: '充电桩'
    }, {
      name: '换电柜',
      selectIcon: '/image/huandiangui-select-icon.png',
      icon: '/image/huandiangui-icon.png',
      id: 3,
      value: '换电柜'
    }, {
      name: '充电柜',
      selectIcon: '/image/chongdiangui-select-icon.png',
      icon: '/image/chongdiangui-select.png',
      id: 4,
      value: '充电柜'
    }],
    markCheckedShow: false,
    choiceTypeValue: 1,
    showMoreType: false,
    userCurLocation: { //  用户当前定位坐标
      latitude: 0,
      longitude: 0,
      city: ''
    },
    latitude: 0,
    longitude: 0,
    markers:[],
    polyline: [],
    show: false,
    currentMarkers: {},
    deviceDetail: {},
    showBigImage: {
      flag: false,
      url: ''
    },
    showLogin: false,
    showCity: false,
    mapScal: 15,
    fileList: [],
    picture: [],
    showProcess: false,
    processValue: 0,
    deviceId: 0,
    loadObj: {
      collectLoading: false
    },
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('100000001', this)
    this.setData({
      visibleAddDeviceGift: true
    })
  },

  // 点击展示大图
  showBig(e) {
    wx.hideTabBar();
    this.setData({
      showBigImage: {
        flag: true,
        url: e.currentTarget.dataset.url
      }
    })
  },

  // 关闭大图
  onCloseMark() {
    this.setData({
      showBigImage: {
        flag: false,
        url: ''
      }
    })
    wx.showTabBar();
  },

  loginSureHandle(){
    setTimeout(() => {
      this.setData({
        showLogin: false
      })
    }, 500)
  },

  onLoad: function (options) {
    this.setData({
      isNoticeScrollable: true,
      noticeBarText: initNoticeBarText
    })

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    // 检查ticket是否存在
    if (wx.getStorageSync('ticket')) {
      // 先检查用户是否登录
      this.checkSessionHandle()
    } else {
      wx.clearStorageSync()
      this.login()
    }
  },

  // 申请获取位置的操作
  appForLocation () {
    // 先校验用户是否拒绝过
    if (wx.getStorageSync('scope.userLocation') === false) {
      this.checkSetting()
    } else {
      this.getCurrentLocation()
    }
  },

  // 检查位置授权情况
  checkSetting () {
    wx.getSetting({
      success: (res) => {
        // 判断是否已经授权地理位置
        if (!res.authSetting['scope.userLocation']) {
          // 没有授权，弹出模态框
          this.showModal()
        } else {
          this.getCurrentLocation()
        }
      }
    })
  },

  // 检查登录是否过期
  checkSessionHandle() {
    wx.checkSession({
      success: (res) => {
        this.appForLocation()
      },
      fail: (err) => {
        wx.clearStorageSync()
        this.login()
      }
    })
  },

  // 微信登录
  login() {
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.setStorageSync('code', res.code)
          wx.getUserInfo({
            withCredentials: true,
            success: (suc) =>{
              this.getTicket(suc)
            },
            fail: (err) => {
              console.error('调用getUserInfo接口失败：' + err)
            }
          })
        }
      },
      fail: (err) => {
        console.log('登录失败！' + err.errMsg)
      }
    })
  },

  // 调用后端接口拿ticket
  getTicket(param) {
    wx.request({
      url: url + '/api/user/authorize',
      method: 'POST',
      data: {
        code: wx.getStorageSync('code'),
        encryptedData: param.encryptedData,
        iv: param.iv,
        signature: param.signature,
        rawData: param.rawData
      },
      success: (res) => {
        wx.setStorageSync('ticket', res.data.data?.ticket)
        wx.setStorageSync('isNoticeBar', true)
        this.appForLocation()
        this.onShow()
      },
      fail: (err) => {
        console.error('获取ticket失败：', err)
      }
    })
  },

  // 引导用户授权的模态框
  showModal() {
    wx.showModal({
      title: '提示',
      content: '您需要授权地理位置才能使用该功能',
      success: (res) => {
        // 判断用户是否点击确定
        if (res.confirm) {
          // 点击确定，跳转到设置页面
          this.openSetting()
        } else if (res.cancel) {
          // 点击取消，弹出提示框
          this.showToast()
        }
      }
    })
  },

  // 跳转到设置页面
  openSetting () {
    // 调用 wx.openSetting 接口
    wx.openSetting({
      success: (res) => {
        // 判断是否已经授权地理位置
        if (res.authSetting['scope.userLocation']) {
          // 已经授权，重新获取地理位置
          this.getCurrentLocation()
        } else {
          // 没有授权，弹出提示框
          this.showToast()
        }
      }
    })
  },

  // 搜索
  toSearch() {
    wx.navigateTo({
      url: `/pages/search/index?latitude=${this.data.latitude}&longitude=${this.data.longitude}`,
    })
  },

  // 弹出提示框
  showToast: () => {
    wx.showToast({
      title: '无法获取地理位置',
      icon: 'none',
      duration: 2000
    })
  },

  getCurrentLocation: function () {
    wx.showLoading({
      title: '加载中...',
    })
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      highAccuracyExpireTime: 3500,
      success: (res) => {
        const latitude = res.latitude
        const longitude = res.longitude

        console.log('用户当前位置', latitude, longitude, res)

        wx.setStorageSync('currentPosition', JSON.stringify({ latitude, longitude }))
        this.setData({
          latitude,
          longitude,
          userCurLocation: {
            latitude,
            longitude,
            city: getApp().globalData.userLocationInfo.city || ''
          },
        })
      },
      fail: (err) => {
        console.error(err)
        wx.setStorageSync('scope.userLocation', false)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  // 地图拖拽时更新地图的中心坐标
  regionchange(e) {
    // 地图视野变化时触发
    if (e.type === 'end') {
      // 用户停止拖动地图
      // 创建 map 上下文对象
      // this.mapCtx = wx.createMapContext('myMap')
      this.mapCtx?.getCenterLocation({
        success: (res) => {
          // 设置当前的地图中心坐标为用户坐标
          wx.setStorageSync('currentPosition', JSON.stringify({ latitude: res.latitude, longitude: res.longitude }))
          // 根据当前的地图中心坐标，查看周围的设备
          const obj = this.data.chargeBtnArray.find(item => item.id === this.data.choiceTypeValue)
          if (timeId) {
            clearTimeout(timeId)
          }
          timeId = setTimeout(() => {
            this.getDeviceList(obj.value, detailLatiuteAndLongitude.latitude || res.latitude, detailLatiuteAndLongitude.longitude || res.longitude)
            // this.getDeviceList(obj.value, this.data.latitude || res.latitude, this.data.longitude || res.longitude)
          }, 500)
        },
        fail: (err) => {
          console.error(err)
        }
      })
    }
  },

  // 点击标记点
  markertap(event) {
    if (!wx.getStorageSync('nickName')) {
      return this.setData({
        showLogin: true
      })
    }
    const markerId = event.markerId || event.detail.markerId; // 获取点击的标记点的 id
    commonMarkId = markerId
    const selectedMarker = this.data.markers.find(marker => marker.id === markerId);
    // 在这里可以根据 selectedMarker 执行需要的操作，比如显示信息窗口等
    const tempArr = JSON.parse(JSON.stringify(this.data.markers))
    tempArr.forEach(item => {
      item.iconPath = item.id === markerId ? item.selectIconPath : mapIcon[item.deviceType]
    })
    this.setData({
      markers: tempArr
    })
    this.getDeviceDetail(selectedMarker, true)
  },

  // 关闭详情
  closeMarkDetail() {
    this.setData({
      markCheckedShow: false
    })
    commonMarkId = 0
    detailLatiuteAndLongitude = {
      latitude: 0,
      longitude: 0
    }
    const tempArr = JSON.parse(JSON.stringify(this.data.markers))
    tempArr.forEach(item => {
      item.iconPath = mapIcon[item.deviceType]
    })
    this.setData({
      markers: tempArr
    })
  },

  // 去纠错
  goErrorCorrection(e) {
    const id = e.currentTarget.dataset.id
    const detail = e.currentTarget.dataset.detail
    wx.navigateTo({
      url: `/pages/errorCorrection/index?id=${id}&detail=${encodeURIComponent(JSON.stringify(detail))}`,
    })
  },

  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },

  choiceType: function (e) {
    this.setData({
      choiceTypeValue: e.currentTarget.dataset.index,
      markCheckedShow: false,
      mapScal: 15
    }, () => {
      const obj = this.data.chargeBtnArray.find(item => item.id === e.currentTarget.dataset.index)
      const getCenter = JSON.parse(wx.getStorageSync('centerPosition') || '{}')
      if (getCenter.longitude) {
        this.getDeviceList(obj.value, getCenter.latitude, getCenter.longitude)
      } else {
        this.getDeviceList(obj.value)
      }
    })
  },

  // 添加设备
  addDeviceHandle() {
    const tempCurrentUserInfo = wx.getStorageSync('nickName')
    if (tempCurrentUserInfo) {
      wx.navigateTo({
        url: `/pages/addDevice/index`,
      })
    } else {
      this.setData({
        showLogin: true
      })
    }
  },

  // 新的添加设备
  handleAddDevice() {
    // pages/addDeviceNew/index
    wx.navigateTo({
      url: `/pages/addDeviceNew/index`,
    })
  },

  // 跳转设备详情
  handleGoDeviceDetail() {
    wx.navigateTo({
      url: `/pages/deviceDetail/index`,
    })
  },

  

  // 获取用户所在位置附近的设备列表
  getDeviceList(type, latitude2, longitude2) {
    const currentPosition = JSON.parse(wx.getStorageSync('currentPosition') || '{}')
    const latitude = latitude2 || currentPosition.latitude
    const longitude = longitude2 || currentPosition.longitude
    wx.request({
      url: url + '/api/device/nearbyList',
      method: 'GET',
      data: {
        city: app.globalData.address,
        device_type: type,
        coordinate: `${latitude},${longitude}`,
        page: 1,
        size: 20,
        ticket: wx.getStorageSync('ticket')
      },
      success: (res) => {
        if (res.data.code !== 0) {
          return this.login()
        }
        const data = res.data.data?.list || []
        const tempMarkers = data.map((item, index) => {
          const coordinate = item.coordinate.split(',')
          return {
            id: item.id * 1,
            latitude: coordinate[0] * 1,
            longitude: coordinate[1] * 1,
            iconPath: mapIcon[item.device_type],
            selectIconPath: selectMapIcon[item.device_type],
            deviceType: item.device_type,
            // joinCluster: true, // 聚合
            width: 28 + 'px', // 标记点图标宽度
            height: 40 + 'px' // 标记点图标高度
          }
        })
        this.setData({
          markers: tempMarkers,
          visibleCenterLocationAdd: !tempMarkers.length, // 如果附近没有设备就显示中心点添加按钮
        }, () => {
          if (commonMarkId) {
            this.ifDeveiceDetail()
          }
        })
      },
      fail: (err) => {
        console.error(err)
      },
    })
  },

  // 获取列表后判断是否需要请求详情
  ifDeveiceDetail() {
    const selectedMarker = this.data.markers.find(marker => marker.id === commonMarkId) || {}
    if (!selectedMarker.id) return
    // 在这里可以根据 selectedMarker 执行需要的操作，比如显示信息窗口等
    const tempArr = JSON.parse(JSON.stringify(this.data.markers))
    tempArr.forEach(item => {
      item.iconPath = item.id === commonMarkId ? item.selectIconPath : mapIcon[item.deviceType]
    })
    this.getDeviceDetail(selectedMarker)
    setTimeout(() => {
      this.setData({
        markers: tempArr
      })
    }, 200)
  },

  /**
   *  获取设备详情
   * @param {Object} param query参数
   * @param {Boolean} isClickMark 是否是点击地图上的标记点触发
   */
  getDeviceDetail(param, isClickMark) {
    if (isClickMark) {
      wx.showLoading({
        title: '加载中...',
      })
    }

    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      highAccuracyExpireTime: 3500,
      success: (res) => {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.request({
          url: url + '/api/device/detail',
          method: 'GET',
          data: {
            ticket: wx.getStorageSync('ticket'),
            id: param.id,
            coordinate: `${latitude},${longitude}`
          },
          success: (res) => {
            const { pic_cover, pictures = [] } = (res.data.data || {})
            const showPictures = []
            if (!pic_cover) {
              res.data.data.pic_cover = false
            } else {
              // showPictures.push({
              //   url: pic_cover,
              //   name: '设备缩略图1',
              //   deletable: false
              // })
              pictures?.forEach((item, i) => {
                const params = {
                  url: item.pic_url,
                  name: `设备缩略图${i+1}`,
                  deletable: false
                }
                
                if (i === pictures.length - 1) {
                  showPictures.unshift(params)
                } else {
                  showPictures.push(params)
                }
              })
            }

            // const tempArr = []
            // res.data.data?.pictures.forEach((item, i) => {
            //   tempArr.push({
            //     url: item.pic_url,
            //     name: i,
            //     deletable: false
            //   })
            // })
            // res.data.data.showPictures = tempArr

            res.data.data.showPictures = showPictures
            this.setData({
              deviceDetail: res.data.data,
              markCheckedShow: true,
              fileList: [],
              picture: [],
              deviceId: param.id
            })
            // 开始路线规划
            // this.line(`${latitude},${longitude}`, `${res.data.data.coordinate}`)
          },
          fail: () => {
            wx.showToast({
              title: '获取设备出错',
              icon: 'fail'
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: (err) => {
        console.error(err)
      }
    })
  },

  onShow() {
    // 处理全局开关
    wx.request({
      url: url + '/api/forum/viewswitch',
      method: 'GET',
      data: {},
      success: function(res) {
        const resData = res?.data || {}
        if (resData.code === 0) {
          wx.setStorageSync('isView', resData.data)
        } else {
          wx.setStorageSync('isView', false)
        }
      },
      fail: function(err) {
        wx.setStorageSync('isView', false)
      }
    })

    // 地图顶部通知
    this.setData({
      isNoticeScrollable: true,
      isNoticeBar: wx.getStorageSync('isNoticeBar'),
      noticeBarText: initNoticeBarText
    })

    // 如果是结束预览图片触发return
    if (isViewImg) {
      isViewImg = false
      return
    }

    if (wx.getStorageSync('ticket')) {
      // const obj = this.data.chargeBtnArray.find(item => item.id === this.data.choiceTypeValue)
      const options = JSON.parse(wx.getStorageSync('detailObj') || '{}')
      // this.mapCtx = wx.createMapContext('myMap')
      // const type: 'viewDevice',
      const type = options.type

      if (type === 'viewDevice') { // 查看设备
        if (!options.id) return
        commonMarkId= options.id // 获取点击的标记点的 id
  
        detailLatiuteAndLongitude = {
          latitude: options.latitude * 1,
          longitude: options.longitude * 1
        }
        this.setData({
          mapScal: 20
        }, () => {
          // 移动
          this.mapCtx.moveToLocation({
            latitude: options.latitude * 1,
            longitude: options.longitude * 1,
            success: () => { // 移动成功
              wx.removeStorageSync('detailObj')
            },
            fail: function (error) {
              // 移动失败，可以处理错误情况
              console.error(error);
            }
          });
        })
      } else if (type === 'viewLocation') { // 查看位置
        // 移动
        this.mapCtx.moveToLocation({
          latitude: options.latitude * 1,
          longitude: options.longitude * 1,
          success: () => {
            // 移动成功
            wx.removeStorageSync('detailObj')
          },
          fail: function (error) {
            // 移动失败，可以处理错误情况
            console.error(error);
          }
        });
      }
    }
  },

  // 回到当前位置
  goBackCurrentPosition() {
    // const currentPosion = {
    //   latitude: this.data.latitude,
    //   longitude: this.data.longitude
    // }
    // if (!currentPosion.latitude) return

    const currentPosion = {
      latitude: this.data.userCurLocation.latitude,
      longitude: this.data.userCurLocation.longitude,
    }

    const that = this

    wx.getSetting({
      success: (res) => {
        // 判断是否已经授权地理位置
        if (!res.authSetting['scope.userLocation']) {
          // 没有授权，弹出模态框
          this.showModal()
        } else {
          this.setData({
            mapScal: 15,
            ...currentPosion
          })
           
          this.mapCtx.moveToLocation({
            latitude: currentPosion.latitude,
            longitude: currentPosion.longitude,
            success: function() {
              getReverseGeocoder({
                location: currentPosion
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
      
                  that.setData({
                    userCurLocation: {
                      ...that.data.userCurLocation,
                      city: params.city
                    },
                  })
              })
            }
          })
        }
      }
    })
  
    // this.setData({
    //   mapScal: 15,
    //   ...currentPosion
    // })
     
    // this.mapCtx.moveToLocation({
    //   latitude: currentPosion.latitude,
    //   longitude: currentPosion.longitude,
    //   success: function() {
    //     getReverseGeocoder({
    //       location: currentPosion
    //     }).then(res => {
    //       const result = res.result
    //         const ad_info = result?.ad_info || {}
    //         const params = {
    //           province: ad_info.province,
    //           city: ad_info.city,
    //           district: ad_info.district,
    //           town: result.address_reference?.town?.title || '',
    //           name: result.address_reference.landmark_l2.title,
    //           address: result.formatted_addresses.recommend,
    //           location: result.location,
    //           latitude: result.location.lat,
    //           longitude: result.location.lng,
    //         }
    //         app.globalData.curPositionInfo = params
    //         app.globalData.address = params.city

    //         that.setData({
    //           userCurLocation: {
    //             ...that.data.userCurLocation,
    //             city: params.city
    //           },
    //         })
    //     })
    //   }
    // })
  },

  // 查看评论详情
  lookCommentDetail(e) {
    wx.navigateTo({
      url: `/pages/comment/index?id=${e.currentTarget.dataset.id}`,
    })
  },

  skipChargePage: function() {
    wx.navigateTo({
      url: `/pages/chargeDevice/index?type=${this.data.choiceTypeValue}`,
    })
  },

  // 城市选择
  showAddressChoice() {
    this.setData({
      show: true
    })
  },

  // 调用第三方导航
  goPosition() {
    const tempObj = this.data.deviceDetail
    wx.openLocation({
      latitude: tempObj.coordinate.split(',')[0] * 1, // 目的地纬度
      longitude: tempObj.coordinate.split(',')[1] * 1, // 目的地经度
      name: tempObj.name, // 目的地名称
      address: tempObj.address, // 目的地地址
    })
    // const currentPosion = JSON.parse(wx.getStorageSync('currentPosition') || {})
  },

  // 关闭城市选择
  onClose() {
    this.setData({
      show: false
    })
  },

  // 上传的图片删除
  imageDelete(e) {
    const tempArr = this.data.fileList
    tempArr.splice(e.detail.index, 1)
    const tempPicture = tempArr.map(item => item.url)
    this.setData({
      fileList: tempArr,
      picture: tempPicture
    })
  },

  handleClickUpload() {
    isViewImg = true
  },

  // 上传前校验
  beforeRead(event) {
    const { file, callback } = event.detail;
    if (file[0].size > 5242880) {
      Toast('文件大小不能超过 5M');
      callback(false)
    } else {
      return callback(true)
    }
    // callback(file.type === 'image');
  },

  // 上传操作
  afterRead(event) {
    const { file } = event.detail;
    file.forEach(item => {
      const uploadTask = wx.uploadFile({
        url: url + "/api/file/upload", // 服务端接收上传文件的路由
        filePath: item.url,
        name: 'file',
        formData: {
          ticket: wx.getStorageSync("ticket"), // 其他额外的表单数据
        },
        success: (res) => {
          wx.showToast({
            title: "上传成功",
            icon: "success",
          });
          const responseData = JSON.parse(res.data)
          const arr = this.data.fileList.concat([
            {
              url: responseData.data.url,
              deletable: true,
              name: "图片",
            },
          ])
          const tempPicture = arr.map(item => item.url)
          this.setData({
            fileList: arr,
            picture: tempPicture,
            markCheckedShow: true
          }, () => {
            this.deviceUpload()
          });
        },
        fail: (err) => {
          wx.showToast({
            title: "上传失败",
            icon: "error",
          });
        },
      });
      uploadTask.onProgressUpdate((res) => {
        this.setData({
          showProcess: true,
          processValue: res.progress
        })
        if (res.progress === 100) {
          this.setData({
            showProcess: false,
            processValue: 0
          })
        }
      })
    })
  },

  // 点击预览图片
  handleClickViewImg(e) {
    isViewImg = true
  },

  // 设备图片上传
  deviceUpload() {
    wx.request({
      url: url + '/api/user/correct',
      method: 'POST',
      data: {
        ticket: wx.getStorageSync('ticket'),
        picture: this.data.picture,
        description: '没有图片',
        error_type: '设备信息有误',
        device_id: this.data.deviceId
      },
      success: (res) => {
        if (!res.data.code) {
          wx.showToast({
            title: '等待审核',
            icon: 'success',
          })
          // setTimeout(() => {
          //   wx.navigateBack({
          //     delta: 1 // 返回上一级页面
          //   })
          // }, 1000)
        }
      },
      fail: (err) => {
        console.error('纠错失败：', err)
      }
    })
  },

  // 路线规划
  line(from, to) {
    QQMapWX.direction({
      mode: 'bicycling',
      from,
      to,
      accuracy: 2,
      success: (res) => {
        var result = res.result
        var route = result.routes[0]
        var coors = route.polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        this.setData({
          // 将路线的起点设置为地图中心点
          latitude:pl[0].latitude,
          longitude:pl[0].longitude,
          // 绘制路线
          polyline: [{
            points: pl,
            color: '#58c16c',
            width: 4,
            borderColor: '#2f693c',
            borderWidth: 1
          }],
        })
      },
      fail: (err) => {
        console.error(err)
      }
    })
  },
  // 禁止滚动
  openRegular() {
    this.setData({
      showCity: true
    })
  },

  // 选中城市
  selectAddress(e) {
    const isUserCity = e.detail.isUserCity

    const appGlobData = app.globalData
    const obj = isUserCity ? appGlobData.userLocationInfo : appGlobData.curPositionInfo

    const latitude = obj.latitude
    const longitude = obj.longitude

    if (latitude && longitude) {
      this.setData({
        latitude,
        longitude,
      }, () => {
        this.mapCtx.moveToLocation({
          latitude,
          longitude,
          success: () => {
            // 移动成功
            console.log('移动成功')
          },
          fail: function (error) {
            // 移动失败，可以处理错误情况
            console.error(error);
          }
        })
      })
    }
  },

  // 收藏、取消收藏
  handleCollectDevice(e) {
    if (this.data.loadObj.collectLoading) {
      return
    }
    const curDevice = e.currentTarget.dataset.detail
    this.setData({
      loadObj: { ...this.data.loadObj, collectLoading: true }
    })

    apis.collectDevice({
      device_id: curDevice.id,
      type: curDevice.is_collect === 1 ? 2 : 1, // 1-收藏 2-取消
    }).then(res => {
      this.setData({
        deviceDetail: {
          ...this.data.deviceDetail,
          is_collect: curDevice.is_collect === 1 ? 0 : 1
        }
      })
    }).finally(() => {
      this.setData({
        loadObj: { ...this.data.loadObj, collectLoading: false }
      })
    })
  },

  // 关闭NoticeBar通知
  handleCloseNoticeBar() {
    wx.removeStorageSync('isNoticeBar')
    this.setData({
      isNoticeBar: false
    })
  },

  // 取消添加设备兑换礼品弹窗
  handleCancelAddGift() {
    this.setData({
      visibleAddDeviceGift: false
    })
  },

  onHide() {
    this.setData({
      isNoticeScrollable: false, // 顶部通知停止滚动
      noticeBarText: initNoticeBarText
    })

    // 如果是预览图片触发hide直接return
    if (isViewImg) return

    // 为了解决一些之前遗留复杂问题优化，暂时注释以下代码
    // this.setData({
    //   mapScal: 15
    // })
    // this.closeMarkDetail()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.setData({
      isNoticeScrollable: false, // 顶部通知停止滚动
      noticeBarText: initNoticeBarText
    })
  },
})


