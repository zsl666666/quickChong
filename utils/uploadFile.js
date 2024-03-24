import { url } from "./util"

export const customUploadFile = (params = {}) => {
  const {
    filePath,
    success,
    fail,
    complete,
    progress,
  } = params

  const uploadTask = wx.uploadFile({
    url: url + "/api/file/upload", // 服务端接收上传文件的路由
    filePath: filePath,
    name: 'file',
    formData: {
      ticket: wx.getStorageSync("ticket"), // 其他额外的表单数据
    },
    success: (res) => {
      const responseData = JSON.parse(res.data)
      if (responseData.code !== 0) {
        return wx.showToast({
          title: responseData.msg || '上传失败',
          icon: 'error'
        })
      }

      success && success(responseData.data)
      
      wx.showToast({
        title: "上传成功",
        icon: "success",
      });
    },
    fail: (err) => {
      wx.showToast({
        title: "上传失败",
        icon: "error",
      });
      fail && fail(err)
    },
    complete: () => {
      complete && complete()
    }
  });

  uploadTask.onProgressUpdate(res => {
    progress && progress(res)
  })
}