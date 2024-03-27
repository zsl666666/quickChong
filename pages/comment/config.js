export const STAR_TYPE_BAD = 1 // 较差
export const STAR_TYPE_COMMON = 3 // 一般
export const STAR_TYPE_GOOD = 5 // 满意

export const STAR_TYPE_LIST = [
  {
    label: '较差',
    icon: '/image/deviceDetail/evaluateRateBad.png',
    value: STAR_TYPE_BAD,
    desc: '吐槽一下'
  },
  {
    label: '一般',
    icon: '/image/deviceDetail/evaluateRateCommon.png',
    value: STAR_TYPE_COMMON,
    desc: '挺好的，能满足需求'
  },
  {
    label: '满意',
    icon: '/image/deviceDetail/evaluateRateSatisfaction.png',
    value: STAR_TYPE_GOOD,
    desc: '非常满意，我想夸夸设备'
  }
]

export const STAR_TYPE_MAP = {}
STAR_TYPE_LIST.forEach(item => {
  STAR_TYPE_MAP[item.value] = item
})

// export const STAR_TYPE_MAP = {
//   [STAR_TYPE_BAD]: {
//     label: '较差',
//     icon: '/image/deviceDetail/evaluateRateBad.png'
//   },
//   [STAR_TYPE_COMMON]: {
//     label: '一般',
//     icon: '/image/deviceDetail/evaluateRateCommon.png'
//   },
//   [STAR_TYPE_GOOD]: {
//     label: '满意',
//     icon: '/image/deviceDetail/evaluateRateSatisfaction.png'
//   }
// }