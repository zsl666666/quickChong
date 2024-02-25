import { request } from 'service/index'

// 评论，回复列表
export const getCommentList = (params = {}) => {
  return request(
    {
      url: '/api/forum/commentReplyList',
      method: 'GET',
      data: {
        ...params
      }
    },
    {
      isLoading: true,
    }
  )
}

// 评论，回复
export const postCommentReply = (params = {}) => {
  return request(
    {
      url: '/api/forum/addCommentReply',
      method: 'POST',
      data: {
        ...params
      }
    },
    {
      isLoading: true,
      loadingTitle: '提交中',
      successMsg: '提交成功'
    }
  )
}

// 评论，回复点赞
export const postCommentReplyLike = (params = {}) => {
  return request(
    {
      url: '/api/forum/commentReplyLike',
      method: 'POST',
      data: {
        ...params
      }
    },
    {
      isLoading: false,
    }
  )
}

export default {
  getCommentList,
  postCommentReply,
  postCommentReplyLike
}