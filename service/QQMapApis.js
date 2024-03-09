// 微信地图sdk相关api
import { QQMapWX } from '../utils/index'

/**
 * 逆地址解析
 * https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodReverseGeocoder
 * use case: QQMapWXReverseGeocoder(params)
 */
export const QQMapWXReverseGeocoder = (params = {}) => {
  return QQMapWX.reverseGeocoder(params)
}

// 逆地址解析
export const getReverseGeocoder = (params = {}) => {
  return new Promise((resolve, reject) => {
    QQMapWXReverseGeocoder({
      ...params,
      success: function(res) {
        resolve(res)
      },
      fail: function(error) {
        reject(error)
      }
    })
  })
}