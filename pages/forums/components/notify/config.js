export const MESSAGE_TYPE_ALL = 0
export const MESSAGE_TYPE_LIKE = 1
export const MESSAGE_TYPE_REPLY = 2

export const MESSAGE_TYPE_LIST = [
  {
    label: '全部消息',
    value: MESSAGE_TYPE_ALL,
    icon: '/image/forum/notifyComment.png'
  },
  {
    label: '收到的赞',
    value: MESSAGE_TYPE_LIKE,
    icon: '/image/forum/notifyCollect.png'
  },
  {
    label: '回复与评论',
    value: MESSAGE_TYPE_REPLY,
    icon: '/image/forum/notifyReply.png'
  }
]
export const MESSAGE_TYPE_OBJ = {}
MESSAGE_TYPE_LIST.forEach(item => {
  MESSAGE_TYPE_OBJ[item.value] = item
})