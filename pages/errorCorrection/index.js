// pages/errorCorrection/index.js
import Toast from '@vant/weapp/toast/toast';
import { url } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    quickData: [{
      name: '位置有误',
      id: 1,
      value: '位置有误',
    }, {
      name: '地点不存在',
      id: 2,
      value: '地点不存在',
    }, {
      name: '设备信息有误',
      id: 3,
      value: '设备信息有误',
    }],
    choiceData: [],
    choiceDataValue: '',
    comment: '',
    fileList: [],
    picture: [],
    deviceId: 0,
    showProcess: false,
    processValue: 0,

    deviceData: [{
      name: '充电桩',
      icon: '/image/chongdianzhuang-icon.png',
      selectIcon: '/image/device-chongdianzhuang-select-icon.png',
      id: 0
    }, {
      name: '充电柜',
      icon: '/image/chongdiangui-select.png',
      selectIcon: '/image/deveice-chongdiangui-select-icon.png',
      id: 1
    }, {
      name: '换电柜',
      icon: '/image/huandiangui-icon.png',
      selectIcon: '/image/device-huandiangui-select-icon.png',
      id: 2
    }],
    brand: '', // 设备品牌,
    brand_contact: '', // 联系方式
    around_monitor: '', // 监控
    monitorShow: false, // 选择设备周围监控弹窗
    actions: [{ // 设备监控列表
      name: '单独配置监控措施',
      color: '#646566'
    }, {
      name: '周围建筑有监控',
      color: '#646566'
    }, {
      name: '无监控措施',
      color: '#646566'
    }],
    // 设备数据
    deveiceData: {
      is_scancode: false, // 扫码充电
      is_rainshelter: false, // 是否有防雨棚
      is_charger: false, // 是否自带充电器
      loc_type: null, // 是小区，还是公共
      device_port: 0, // 充电口数量
      device_type: null, // 充电设备类型
    },
    // 设备类型
    deviceTypeData: [{
      name: '公共充电设备',
      value: 2
    }, {
      name: '小区内充电设备',
      value: 1
    }],
    initPosData: {}, // 接口返回地图位置数据
    mapData: {}, // 地图相关数据
    type: '', // 页面类型，view表示是查看纠错数据，不可编辑
    submitLoading: false, // 提交按钮loading
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const type = options.type
    const detail = JSON.parse(decodeURIComponent(options.detail) || '{}')
    const coordinateArr = detail.coordinate.split(',')

    // 设备照片
    const pictures = detail.pictures.length
      ? detail.pictures.map(item => ({
        url: item.pic_url || item,
        name: "图片",
        deletable: type !== 'view',
      })) : []

    this.setData({
      type: type,
      deviceId: options.id,
      deviceDetail: detail,
      initPosData: {
        address: detail.address,
        name: detail.name,
        latitude: coordinateArr[0],
        longitude: coordinateArr[1],
        city: detail.city
      },
      deveiceData: {
        is_scancode: detail.is_scancode === 1, // 扫码充电
        is_rainshelter: detail.is_rainshelter === 1, // 是否有防雨棚
        is_charger: detail.is_charger === 1, // 是否自带充电器
        loc_type: detail.loc_type, // 是小区，还是公共
        device_port: detail.device_port, // 充电口数量
        device_type: detail.device_type, // 充电设备类型
      },
      brand: detail.brand, // 设备品牌
      brand_contact: detail.brand_contact, // 联系方式
      around_monitor: detail.around_monitor, // 设备周围监控
      fileList: pictures, // 设备照片
      comment: detail.description, // 描述
      // 查看纠错信息时，回显纠错设备信息类型
      ...(type === 'view' ? {
        choiceDataValue: detail.error_type || ''
      } : {})
    })
  },

  choiceType: function (e) {
    // const index = e.currentTarget.dataset.index
    // let arr = []
    // if (this.data.choiceData.includes(index)) {
    //   arr = this.data.choiceData.filter(item => item !== index)
    // } else {
    //   arr = this.data.choiceData.concat([index])
    // }
    // const tempMessageItemData = JSON.parse(JSON.stringify(this.data.quickData))
    // tempMessageItemData.forEach(element => {
    //   if (arr.includes(element.id)) {
    //     element.selected = true
    //   } else {
    //     element.selected = false
    //   }
    // });

    // 为查看页面类型时
    if (this.data.type === 'view') return

    this.setData({
      // choiceData: arr,
      choiceDataValue: e.currentTarget.dataset.value,
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
            picture: tempPicture
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

  // 选择充电设备类型
  choiceDeviceType(e) {
    // 为查看页面类型时
    if (this.data.type === 'view') return

    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        device_type: e.currentTarget.dataset.name
      }
    })
  },

  // 监控选择弹窗显示
  showMonitor() {
    this.setData({
      monitorShow: true
    })
  },
  // 关闭
  onCloseAction() {
    this.setData({
      monitorShow: false
    })
  },
  // action 选择
  onSelect(event) {
    this.setData({
      around_monitor: event.detail.name
    })
  },

  // 扫码充电
  scanCode({ detail }) {
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        is_scancode: detail
      }
    })
  },
  // 防雨棚
  rainshelter({ detail }) {
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        is_rainshelter: detail
      }
    })
  },
  // 是否自带充电器
  auoCharger({ detail }) {
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        is_charger: detail
      }
    })
  },

  // 端口数量
  devicePortHandle(value) {
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        device_port: value.detail
      }
    })
  },

  // 选择类型-公共充电设备，还是小区充电设备
  publicPlotType(e) {
    // 为查看页面类型时
    if (this.data.type === 'view') return

    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        loc_type: e.currentTarget.dataset.value
      }
    })
  },

  // 地图数据改变
  handleMapDataChange(e) {
    this.setData({
      mapData: e.detail
    })
  },

  // 提交纠错
  errorCorrection() {
    // const nameData = this.data.quickData.filter(item => this.data.choiceData.includes(item.id))
    // const tempName = nameData.map(item => item.name)

    const data = this.data

    // 为查看页面类型时
    if (data.type === 'view') return

    // 防重复点击
    if (data.submitLoading) return

    const mapData = data.mapData
    // 校验纠错设备信息
    if (!data.choiceDataValue) {
      return Toast('纠错设备信息不能为空')
    }
    // 校验纠错设备信息-位置有误的情况
    if (data.choiceDataValue === '位置有误') {
      if (!mapData.name || !mapData.city || !mapData.address) {
        return Toast('位置信息不能为空')
      }
    }
    // 校验纠错设备信息-设备信息有误，充电设备类型
    if (data.choiceDataValue === '设备信息有误' && !data.deveiceData.device_type) {
      return Toast('充电设备类型不能为空') 
    }

    // 校验设备照片
    // if (this.data.picture.length < 3) {
    //   return Toast('设备图片至少三张')
    // }

    const params = {
      ...data.deveiceData,
      device_id: Number(data.deviceId),
      error_type: data.choiceDataValue, // 纠正设备信息
      ...data.mapData, // 位置信息(坐标，省市区，位置名称，详细地址)
      coordinate: `${mapData.latitude},${mapData.longitude}`, // 坐标点（经纬度）
      brand: data.brand, // 品牌
      brand_contact: data.brand_contact, // 联系方式
      around_monitor: data.around_monitor, // 设备周围监控
      device_code: null, // 设备编码，暂时没有该字段
      description: data.comment, // 描述
      picture: data.picture, // 设备照片
    }
    console.log('纠错提交接口参数', params)

    this.setData({
      submitLoading: true
    })

    wx.request({
      url: url + '/api/user/correct',
      method: 'POST',
      data: {
        ticket: wx.getStorageSync('ticket'),
        ...params
        // picture: this.data.picture,
        // description: this.data.comment,
        // error_type: tempName.join(','),
        // device_id: this.data.deviceId
      },
      success: (res) => {
        if (!res.data.code) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
          })
          setTimeout(() => {
            this.setData({
              submitLoading: false
            })
            wx.navigateBack({
              delta: 1 // 返回上一级页面
            })
          }, 1000)
        } else {
          wx.showToast({
            title: res.data.msg || '提交失败',
            icon: 'fail'
          })
          this.setData({
            submitLoading: false
          })
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '提交失败',
          icon: 'fail'
        })
        this.setData({
          submitLoading: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})