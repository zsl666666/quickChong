
export const CONTRIBUTE_TYPE_ADD = 'add'
export const CONTRIBUTE_TYPE_CORRECTION = 'correction'
export const CONTRIBUTE_TYPE_LIST = [
  {
    label: "添加",
    value: CONTRIBUTE_TYPE_ADD
  },
  {
    label: "纠错",
    value: CONTRIBUTE_TYPE_CORRECTION
  }
]

export const APPROVE_STATUS_PASS = 'pass' // 审批通过
export const APPROVE_STATUS_DOING = 'doing' // 审批中
export const APPROVE_STATUS_REJECT = 'reject' // 审批驳回
export const APPROVE_STATUS_ALL = '' // 全部
export const APPROVE_STATUS_LIST = [
  {
    label: '全部',
    value: APPROVE_STATUS_ALL
  },
  {
    label: '审批通过',
    value: APPROVE_STATUS_PASS,
    nameStyle: {
      background: 'rgba(18, 219, 114, 0.1)',
      color: '#16AA52',
    }
  },
  {
    label: '审批中',
    value: APPROVE_STATUS_DOING,
    nameStyle: {
      background: 'rgba(255, 156, 42, 0.1)',
      color: '#FF9C2A',
    }
  },
  {
    label: '审批驳回',
    value: APPROVE_STATUS_REJECT,
    nameStyle: {
      background: 'rgba(252, 30, 28, 0.1)',
      color: '#FC1E1C',
    }
  }
]
export const APPROVE_STATUS_OBJ = {}
APPROVE_STATUS_LIST.forEach(item => {
  if (item.value) {
    APPROVE_STATUS_OBJ[item.value] = item
  } 
})

