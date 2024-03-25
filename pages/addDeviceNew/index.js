// pages/addDeviceNew/index.js
import { customUploadFile } from 'utils/uploadFile'
import { url } from 'utils/index'
import * as CONFIG from './config'
import Toast from '@vant/weapp/toast/toast'
import apis from './apis'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CONFIG,
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
    // 运维状态列表
    maintenanceStatus: [
      {
        label: '是',
        value: '是',
      },
      {
        label: '否',
        value: '否',
      }
    ],
    // 三种特殊类型设备照片的上传
    uploadSpecialTypes: [
      {
        icon: '/image/addDevice/addUploadTypeOneIcon.png',
        url: '',
        desc: '上传带有二维码的照片'
      },
      {
        icon: '/image/addDevice/addUploadTypeTwoIcon.png',
        url: '',
        desc: '上传设备整体照片'
      },
      {
        icon: '/image/addDevice/addUploadTypeThreeIcon.png',
        url: '',
        desc: '上传环境建筑物照片'
      }
    ],
    commonPictures: [], // 普通上传的设备图片
    deveiceData: { // 添加设备的数据
      device_type: '', // 充电设备类型
      loc_type: '', // 设备地点类型，住宅区，办公区....
      brand: '', // 设备品牌
      operation_status: '', // 运维状态
      open_status: '', // 开发状态
      description: '', // 描述
      // device_num: 1, // 设备数
      device_number: 1, // 设备数
      device_port: 1, // 充电端口数量
      power_range: '', // 功率范围
      is_recharge: '', // 是否需要预充值
      is_refund: '', // 是否支持预充值
      payment_way: '', // 付款方式
      fee: '', // 收费详情
      is_rainshelter: 0, // 有无防雨措施
      is_charger: 0, // 是否自带充电器
      is_fast: 2, // 快充还是慢充
    },
    actionList: [], // 下拉选择弹窗列表
    showActionSheet: false, // 是否显示下拉选择弹窗
    isExpansion: false, // 是否展开更多信息
    mapData: {}, // 选择地图位置相关数据，省市区，经度纬度等
    submitLoading: false, // 提交按钮loading
    isShowConfirmPopup: false, // 是否显示二次确认弹窗
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  },

  // 处理显示下拉选择弹窗
  handleShowActionSheet(e) {
    const actionSheetType = e.currentTarget.dataset.type
    console.log('处理显示下拉选择弹窗', e, actionSheetType, CONFIG.actionSheetListMap[actionSheetType])
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
    })
  },

  // 地图数据改变
  handleMapDataChange(e) {
    this.setData({
      mapData: e.detail
    })
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

  // 选择设备地方类型
  handleChangeDeviceSiteType(e) {
    // deveiceData.device_type
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        loc_type: e.currentTarget.dataset.value
      }
    })
  },

  // 处理展开/收起更多信息
  handleExpansionChange() {
    this.setData({
      isExpansion: !this.data.isExpansion
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

  // 设备品牌
  handleBrand(e) {
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        brand: e.detail
      }
    })
  },

  // 收费详情
  handleFee(e) {
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

  // 特殊种类上传
  handleSpecialUplaod(e) {
    console.log('上传特殊类型的图片', e)
    const curSpecialIndex = e.currentTarget.dataset.index
    const { file } = e.detail;

    if (file && file.length === 1) {
      customUploadFile({
        filePath: file[0].url,
        success: (data = {}) => {
          const url = data.url
          const newUploadSpecialTypes = [...this.data.uploadSpecialTypes]
          newUploadSpecialTypes[curSpecialIndex].url = url
          this.setData({
            uploadSpecialTypes: newUploadSpecialTypes
          })
        }
      })
    }

    // file.forEach(item => {
    //   customUploadFile({
    //     filePath: item.url,
    //     success: (data = {}) => {
    //       const url = data.url
    //       console.log('上传成功', data)
    //     }
    //   })
    // })
  },

  // 特殊种类删除
  handleSpecialDelete(e) {
    const curSpecialIndex = e.currentTarget.dataset.index

    const newUploadSpecialTypes = [...this.data.uploadSpecialTypes]
    newUploadSpecialTypes[curSpecialIndex].url = ''

    this.setData({
      uploadSpecialTypes: newUploadSpecialTypes
    })
  },

  // 预览图片
  handlePreview(e) {
    const curUrl = e.detail.url

    const pics = []
    this.data.uploadSpecialTypes.forEach(item => {
      item.url && pics.push(item.url)
    })
    this.data.commonPictures.forEach(item => {
      item.url && pics.push(item.url)
    })

    wx.previewImage({
      current: curUrl,
      urls: pics || [],
    })
  },

  // 普通上传
  handleUplaodAfterRead(e) {
    const { file } = e.detail;

    file.forEach(item => {
      customUploadFile({
        filePath: item.url,
        success: (data = {}) => {
          const url = data.url
          this.setData({
            commonPictures: this.data.commonPictures.concat({ url })
          })
        }
      })
    })
  },
  // 普通删除
  handleCommonDelete(e) {
    const curIndex = e.detail.index
  
    const newList = [...this.data.commonPictures]
    newList.splice(curIndex, 1)

    this.setData({
      commonPictures: newList
    })
  },

  postAddDevice() {
    const {
      deveiceData,
      mapData,
      submitLoading,
      uploadSpecialTypes,
      commonPictures
    } = this.data

    // 防重复点击
    if (submitLoading) return

    this.setData({
      submitLoading: true
    })

    wx.showLoading({
      title: '提交中...',
    })
  
    const params = {
      ...deveiceData,
      ...mapData,
      coordinate: `${mapData.latitude},${mapData.longitude}`,
      devicePosition: mapData.name,
    }

    // 设备照片
    const pictures = []
    uploadSpecialTypes.forEach(item => {
      item.url && pictures.push(item.url)
    })
    commonPictures.forEach(item => {
      item.url && pictures.push(item.url)
    })
    params.picture = pictures

    wx.request({
      url: url + '/api/device/add',
      method: 'POST',
      data: {
        ...params,
        ticket: wx.getStorageSync('ticket')
      },
      success: (res) => {
        if (res.data.code === 0) {
          wx.showToast({
            title: '提交成功，等待审核',
            icon: 'success'
          })
          setTimeout(() => {
            this.setData({
              submitLoading: false
            })
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'fail'
          })
          this.setData({
            submitLoading: false
          })
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '添加失败',
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

  // 提交
  addDeviceHandle() {
    const { submitLoading, deveiceData, mapData } = this.data

    console.log('提交参数', this.data)

    // 防重复点击
    if (submitLoading) return

    if (!deveiceData.device_type) {
      return Toast('充电设备类型不能为空')
    }

    if (!mapData.name || !mapData.city || !mapData.address) {
      return Toast('位置信息不能为空')
    }

    if (!deveiceData.loc_type) {
      return Toast('类型不能为空')
    }

    if (!deveiceData.brand) {
      return Toast('设备品牌不能为空')
    }

    if (!deveiceData.operation_status) {
      return Toast('请选择运维状态')
    }

    if (!deveiceData.open_status) {
      return Toast('请选择开发状态')
    }

    this.setData({
      submitLoading: true
    })

    apis.getAddTimes().then(res => {
      const timesNum = res?.data
      if (timesNum > 3) {
        this.setData({
          submitLoading: false
        }, () => {
          this.postAddDevice()
        })
      } else {
        this.setData({
          isShowConfirmPopup: true,
        })
      }
    }).finally(() => {
      this.setData({
        submitLoading: false
      })
    })

  },

  handleConfirmSubmit() {
    this.postAddDevice()
  },
})