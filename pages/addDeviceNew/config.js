// 运营状态
export const OPERATION_STATUS_NORMAL = 1 // 正常运营
export const OPERATION_STATUS_STOPED = 2 // 已停用
export const OPERATION_STATUS_DISMANTLE = 3 // 已拆除
export const OPERATION_STATUS_LIST = [
  {
    label: '正常运营',
    value: OPERATION_STATUS_NORMAL
  },
  {
    label: '已停用',
    value: OPERATION_STATUS_STOPED
  },
  {
    label: '已拆除',
    value: OPERATION_STATUS_DISMANTLE
  }
]
export const OPERATION_STATUS_LIST_MAP = {}
OPERATION_STATUS_LIST.forEach(item => {
  OPERATION_STATUS_LIST_MAP[item.value] = item
})

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

// 是否预充值
export const IS_RECHARGE_NO_KNOW = 0 // 未知
export const IS_RECHARGE_YES = 1 // 是
export const IS_RECHARGE_NO = 2 // 否
export const IS_RECHARGE_LIST = [
  {
    label: '是',
    value: IS_RECHARGE_YES
  },
  {
    label: '否',
    value: IS_RECHARGE_NO
  },
  {
    label: '未知',
    value: IS_RECHARGE_NO_KNOW
  }
]
export const IS_RECHARGE_LIST_MAP = {}
IS_RECHARGE_LIST.forEach(item => {
  IS_RECHARGE_LIST_MAP[item.value] = item
})

// 是否支持退款
export const IS_REFUND_NO_KNOW = 0 // 未知
export const IS_REFUND_YES = 1 // 是（支持）
export const IS_REFUND_NO = 2 // 否（不支持）
export const IS_REFUND_LIST = [
  {
    label: '是',
    value: IS_REFUND_YES
  },
  {
    label: '否',
    value: IS_REFUND_NO
  },
  {
    label: '未知',
    value: IS_REFUND_NO_KNOW
  }
]
export const IS_REFUND_LIST_MAP = {}
IS_REFUND_LIST.forEach(item => {
  IS_REFUND_LIST_MAP[item.value] = item
})

// 付款方式
export const PAYMENT_WAY_NO_KNOW = 0 // 未知
export const PAYMENT_WAY_SCAN_CODE = 1 // 扫码充电
export const PAYMENT_WAY_COIN = 2 // 投币充电
export const PAYMENT_WAY_CARD = 3 // 刷卡充电
export const PAYMENT_WAY_LIST = [
  {
    label: '扫码充电',
    value: PAYMENT_WAY_SCAN_CODE
  },
  {
    label: '投币充电',
    value: PAYMENT_WAY_COIN
  },
  {
    label: '刷卡充电',
    value: PAYMENT_WAY_CARD
  },
  {
    label: '未知',
    value: PAYMENT_WAY_NO_KNOW
  }
]
export const PAYMENT_WAY_LIST_MAP = {}
PAYMENT_WAY_LIST.forEach(item => {
  PAYMENT_WAY_LIST_MAP[item.value] = item
})

// 下拉选择列表
export const actionSheetListMap = {
  operation_status: OPERATION_STATUS_LIST, // 运营状态
  open_status: OPEN_STATUS_LIST, // 开发状态
  is_recharge: IS_RECHARGE_LIST, // 是否预充值
  is_refund: IS_REFUND_LIST, // 是否预充值
  payment_way: PAYMENT_WAY_LIST, // 付款方式
}