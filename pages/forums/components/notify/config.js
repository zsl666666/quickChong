export const MESSAGE_TYPE_ALL = 'all'
export const MESSAGE_TYPE_LIKE = 'like'
export const MESSAGE_TYPE_REPLY = 'reply'

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