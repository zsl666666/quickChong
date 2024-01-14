// pages/forums/components/postMessage/index.js
import { url } from 'utils/index'
import apis from './apis'

import Toast from '@vant/weapp/toast/toast'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    autosize: {minHeight: '500rpx', maxHeight: '500rpx'}, // 正文输入框高度
    titleValue: '', // 标题
    content: '', // 帖子正文
    contentCode: "", // 帖子内容html dom用户话题高亮
    fileList: [], // 帖子照片
  },
  handleChangeTitleValue(e) {
    this.setData({
      titleValue: e.detail.value
    })
  },
  // 帖子正文输入
  handleChangeContent(e) {
    const value = e.detail.value
    let dom = value
    if (value.trim()) {
      const brStr = value.replace(/\r\n/g, '<br />')
      dom = brStr.replace(/[#＃][^#＃]+[#＃]/g, '<span style="color: #0874b9">$&</span>')
    }
    this.setData({
      content: value,
      contentCode: dom
    })
  },
  // handleEditor(e) {
  //   const value = e.detail.text
  //   const dom = value.trim() ? value?.replace(/[#＃][^#＃]+[#＃]/g, '<span style="color: red">$&</span>') : value

  //   this.setData({
  //     content: value,
  //     contentCode: dom
  //   })
  // },

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
          const responseData = JSON.parse(res.data)
          if (responseData.code !== 0) {
            return wx.showToast({
              title: responseData.msg,
              icon: 'error'
            })
            
          }
          wx.showToast({
            title: "上传成功",
            icon: "success",
          });
          const arr = this.data.fileList.concat([
            {
              url: responseData.data.url,
              deletable: true,
              name: "图片",
            },
          ])
          this.setData({
            fileList: arr,
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

  // 上传的图片删除
  imageDelete(e) {
    const tempArr = this.data.fileList
    tempArr.splice(e.detail.index, 1)
    this.setData({
      fileList: tempArr,
    })
  },

  // 点击发帖
  postMessage() {
    const { titleValue, content, fileList = [] } = this.data
    if (!content || !content.trim()) {
      return Toast('帖子内容不能为空')
    }
    apis.postMessage({
      title: titleValue,
      content: content,
      picture: fileList?.map(item => item.url)
    }).then(res => {
      // wx.navigateBack({
      //   delta: 1
      // })
      wx.setStorageSync('isPostOk', true)
      wx.switchTab({
        url: '/pages/forums/index',
      })
    })
  }
})