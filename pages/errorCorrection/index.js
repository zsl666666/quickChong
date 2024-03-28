// pages/errorCorrection/index.js
import Toast from '@vant/weapp/toast/toast';
import { url } from '../../utils/util'
import * as CONFIG from './config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CONFIG,
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
    choiceDataValue: '',
    fileList: [],
    picture: [],
    deviceId: 0,
    showProcess: false,
    processValue: 0,

    // 充电设备类型
    chargeDeviceTypes: [
      {
        label: '智能充电插座',
        value: '智能充电插座',
        icon: '/image/addDevice/deviceTypeChongDianZuoIcon.png'
      },
      {
        label: '交流电桩',
        value: '交流电桩',
        icon: '/image/addDevice/deviceTypeJiaoLiuDianGuiIcon.png'
      },
      {
        label: '充电柜',
        value: '充电柜',
        icon: '/image/addDevice/deviceTypeChongDianGuiIcon.png'
      },
      {
        label: '换电柜',
        value: '换电柜',
        icon: '/image/addDevice/deviceTypeHuanDianGuiIcon.png'
      }
    ],
    // 设备位置类型
    deviceSiteTypes: [
      {
        label: '住宅区',
        value: 1,
      },
      {
        label: '办公区',
        value: 3,
      },
      {
        label: '商业区',
        value: 4,
      },
      {
        label: '休闲区',
        value: 5,
      },
      {
        label: '工业区',
        value: 6,
      },
      {
        label: '其他',
        value: 2,
      }
    ],
    showActionSheet: false, // 是否显示下拉选择弹窗
    actionList: [], // 下拉选择弹窗列表
    // 设备数据
    deveiceData: {
      device_type: '', // 充电设备类型
      loc_type: '', // 设备地点类型，住宅区，办公区....
      brand: '', // 设备品牌
      operation_status: '', // 运维状态
      open_status: '', // 开发状态
      description: '', // 描述
      device_number: 1, // 设备数
      device_port: 1, // 充电端口数量
      power_range: '', // 功率范围
      is_recharge: '', // 是否需要预充值
      is_refund: '', // 是否支持退款
      payment_way: '', // 付款方式
      fee: '', // 收费详情
      is_rainshelter: 0, // 有无防雨措施
      is_charger: 0, // 是否自带充电器
      is_fast: 2, // 快充还是慢充
    },
    initPosData: {}, // 接口返回地图位置数据
    mapData: {}, // 地图相关数据
    type: '', // 页面类型，view表示是查看纠错数据，不可编辑
    submitLoading: false, // 提交按钮loading
    isShowConfirmPopup: false, // 是否显示二次确认弹窗
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
      // type: 'view',
      deviceId: options.id,
      deviceDetail: detail,
      initPosData: {
        address: detail.address,
        name: detail.name,
        latitude: coordinateArr[0],
        longitude: coordinateArr[1],
        city: detail.city
      },
      deveiceData: { ...detail },
      fileList: pictures, // 设备照片
      // 查看纠错信息时，回显纠错设备信息类型
      ...(type === 'view' ? {
        choiceDataValue: detail.error_type || ''
      } : {})
    })
  },

  choiceType: function (e) {

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
  handleChangechargeDeviceType(e) {
    // 为查看页面类型时
    if (this.data.type === 'view') return

    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        device_type: e.currentTarget.dataset.value
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
  postDeviceCorrection() {
    const data = this.data

    const mapData = data.mapData

    // 为查看页面类型时
    if (data.type === 'view') return

    // 防重复点击
    if (data.submitLoading) return

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

    wx.showLoading({
      title: '提交中...',
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
      },
      complete: () => {
        wx.hideLoading({ noConflict: true })
      }
    })
  },

  errorCorrection() {
    const data = this.data

    // 为查看页面类型时
    if (data.type === 'view') return

    // 防重复点击
    if (data.submitLoading) return

    const mapData = data.mapData
    // 校验纠错设备信息
    if (!data.choiceDataValue) {
      return Toast('请选择纠错设备信息类型')
    }
    // 校验纠错设备信息-位置有误的情况
    if (data.choiceDataValue === '位置有误') {
      if (!mapData.name || !mapData.city || !mapData.address) {
        return Toast('请选择地图位置信息')
      }
    }
    // 校验纠错设备信息-设备信息有误，充电设备类型
    if (data.choiceDataValue === '设备信息有误') {
      if (!data.deveiceData.device_type) {
        return Toast('请选择充电设备类型') 
      }
      if (!data.deveiceData.loc_type) {
        return Toast('请选择类型') 
      }
      if (!data.deveiceData.brand) {
        return Toast('设备品牌不能为空')
      }
      if (!data.deveiceData.operation_status) {
        return Toast('请选择运维状态')
      }
  
      if (!data.deveiceData.open_status) {
        return Toast('请选择开放状态')
      }
    }

    // 显示二次确认弹窗
    this.setData({
      isShowConfirmPopup: true
    })
  },

  handleConfirmSubmit() {
    this.postDeviceCorrection()
  },

  // 选择充电设备类型
  handleChangechargeDeviceType(e) {
    // deveiceData.device_type
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        device_type: e.currentTarget.dataset.value
      }
    })
  },
  // 设备品牌
  handleBrand(e) {
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        brand: e.detail
      }
    })
  },
  // 处理显示下拉选择弹窗
  handleShowActionSheet(e) {
    // 为查看页面类型时
    if (this.data.type === 'view') return

    const actionSheetType = e.currentTarget.dataset.type

    const list = CONFIG.actionSheetListMap[actionSheetType] || []

    this.setData({
      showActionSheet: true,
      actionList: list.map(item => ({
        ...item,
        name: item.label,
        color: '#646566',
        className: 'custom-action-sheet-select',
        field: actionSheetType
      }))
    })
  },
  // 关闭下拉选择弹窗显示
  handleActionSheetClose() {
    this.setData({
      showActionSheet: false,
      actionList: []
    })
  },

  // 下拉选择回调
  handleActionSelect(e) {
    const detail = e.detail
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        [detail.field]: detail.value
      }
    }, () => {
      console.log('gdgdgsgs', this.data.deveiceData, CONFIG.OPERATION_STATUS_LIST_MAP[this.data.deveiceData.operation_status].label)
    })
  },
  // 设备数量
  handleDeviceNum(value) {
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        device_number: value.detail
      }
    })
  },
  // 设备数量
  handleDevicePortNum(value) {
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        device_port: value.detail
      }
    })
  },
  // 功率范围
  handlePowerRange(value) {
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        power_range: value.detail
      }
    })
  },
  // 收费详情
  handleFee(e) {
    // 为查看页面类型时
    if (this.data.type === 'view') return

    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        fee: e.detail
      }
    })
  },
  // 有无防雨措施
  handleRainshelter(e) {
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        is_rainshelter: e.detail ? 1 : 0
      }
    })
  },

  // 是否自带充电器
  handleCharger(e) {
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        is_charger: e.detail ? 1 : 0
      }
    })
  },

  // 快慢充
  handleFast(e) {
    const value = e.currentTarget.dataset.value
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        is_fast: value
      }
    })
  },
  // 描述
  handleDescriptionValueChange(e) {
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        description: e.detail
      }
    })
  },
  // 选择设备地方类型
  handleChangeDeviceSiteType(e) {
    // 为查看页面类型时
    if (this.data.type === 'view') return

    // deveiceData.device_type
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        loc_type: e.currentTarget.dataset.value
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