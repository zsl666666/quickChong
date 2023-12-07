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