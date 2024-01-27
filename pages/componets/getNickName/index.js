// pages/componets/getNickName/index.js
import { url } from '../../../utils/util'

const noLoginImg = '/image/no-login.png'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    avatarUrl: noLoginImg,
    nickNameValue: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChooseAvatar(e) {
      const { avatarUrl } = e.detail
      // this.setData({
      //   avatarUrl,
      // })
      wx.uploadFile({
        url: url + "/api/file/upload", // 服务端接收上传文件的路由
        filePath: avatarUrl,
        name: 'file',
        formData: {
          ticket: wx.getStorageSync("ticket"), // 其他额外的表单数据
        },
        success: (res) => {
          const responseData = JSON.parse(res.data)
          console.log('responseData', responseData)
          if (responseData.code !== 0) {
            return wx.showToast({
              title: '失败',
              icon: 'error'
            })
          }

          this.setData({
            avatarUrl: responseData.data.url
          })
        },
        fail: (err) => {
          wx.showToast({
            title: "失败",
            icon: "error",
          });
        },
      });
    },
    nickNameHandle(e) {
      if (e.detail.pass) {
        // wx.setStorageSync('nickName', this.data.nickNameValue)
        // wx.setStorageSync('avatarUrl', this.data.avatarUrl)
        // this.setData({
        //   nickNameValue: e.detail.value
        // })
      }
    },
    nickNameConfirmHandle(e) {
      this.setData({
        nickNameValue: e.detail.value
      })
    },
    loginConfirm(e) {
      // 使用setTimeout原因是不能立即拿到小程序校验完成的nickNameValue值
      setTimeout(() => {
        const { nickNameValue, avatarUrl } = this.data

        if (!nickNameValue) {
          return wx.showToast({
            title: '不能为空',
            icon: 'error'
          })
        }
        this.setData({
          show: false
        })
        wx.request({
          url: url + '/api/user/setProfile',
          method: 'post',
          data: {
            username: this.data.nickNameValue,
            avatar: this.data.avatarUrl,
            ticket: wx.getStorageSync('ticket')
          },
          success: (res) => {
            console.log(res.data)
            if (res.data.code === 0) {
              wx.setStorageSync('nickName', this.data.nickNameValue)
              wx.setStorageSync('avatarUrl', this.data.avatarUrl)
            }
  
          },
          fail: err => {
            console.error(err)
          }
        })
        this.triggerEvent('loginSure', {});
      }, 100)
    },
    close(action, done) {
      this.setData({
        show: false,
      }, () => {
        setTimeout(() => {
          this.setData({
            avatarUrl: noLoginImg,
          })
        }, 100)
      })
    }
  }
})
