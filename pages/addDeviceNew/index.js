// pages/addDeviceNew/index.js
import { customUploadFile } from 'utils/uploadFile'
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
        value: '住宅区',
      },
      {
        label: '办公区',
        value: '办公区',
      },
      {
        label: '商业区',
        value: '商业区',
      },
      {
        label: '休闲区',
        value: '休闲区',
      },
      {
        label: '工业区',
        value: '工业区',
      },
      {
        label: '其他',
        value: '其他',
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
    deveiceData: { // 添加设备的数据
      device_type: undefined, // 充电设备类型
      loc_type: undefined, // 设备地点类型，住宅区，办公区....
      maintenance_status: undefined, // 运维状态
      is_recharge: undefined, // 是否需要预充值
    },
    isExpansion: false, // 是否展开更多信息
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
})