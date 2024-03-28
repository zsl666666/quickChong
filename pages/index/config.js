// 开发状态
export const OPEN_STATUS_OPEN = 1 // 对外开放
export const OPEN_STATUS_NO_OPEN = 2 // 未开放(仅限内部使用)
export const OPEN_STATUS_LIST = [
  {
    label: '对外开放',
    value: OPEN_STATUS_OPEN
  },
  {
    label: '仅限内部使用',
    value: OPEN_STATUS_NO_OPEN
  }
]
export const OPEN_STATUS_LIST_MAP = {}
OPEN_STATUS_LIST.forEach(item => {
  OPEN_STATUS_LIST_MAP[item.value] = item
})

export const DEVICE_SITE_TYPES = [
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
]
export const DEVICE_SITE_TYPES_MAP = {}
DEVICE_SITE_TYPES.forEach(item => {
  DEVICE_SITE_TYPES_MAP[item.value] = item
})