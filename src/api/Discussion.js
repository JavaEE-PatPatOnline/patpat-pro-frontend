import service from '../http'
import { btoaUTF8 } from 'bestbase64utf8'

const url = {
  all: '/discussion/query',
  create: '/discussion/create',
  delete: '/discussion/delete',
  setTopState: 'admin/discussion/top',
  detail: '/discussion/',
  like: '/discussion/like',
  createComment: '/discussion/reply/create',
  deleteComment: '/discussion/reply/delete',
  likeComment: '/discussion/reply/like',
  verify: 'admin/reply/verify/',
  setStarState: 'admin/discussion/star',
}

export default class Discussion {
  static async getDiscussionDetail(id) {
    return service(url.detail + '/' + id, {
      method: 'GET',
    })
  }
  static async likeDiscussion(id, state) {
    return service(url.like + '/' + id + '?liked=' + state, {
      method: 'POST',
    })
  }
  static async setTopState(id, state) {
    return service(url.setTopState + '/' + id + '?topped=' + state, {
      method: 'POST',
    })
  }
  static async setStarState(id, state) {
    return service(url.setStarState + '/' + id + '?starred=' + state, {
      method: 'POST',
    })
  }
  static async createComment(discussionId, content, toId) {
    const data = { discussionId, content: btoaUTF8(content), toId }
    return service(url.createComment, {
      method: 'POST',
      data,
    })
  }

  static async deleteComment(id) {
    return service(url.deleteComment + '/' + id, {
      method: 'POST',
    })
  }
  static async likeComment(id, state) {
    return service(url.likeComment + '/' + id + '?liked=' + state, {
      method: 'POST',
    })
  }

  static async getDiscussionList({ page, pageSize, query }) {
    const queryParams = new URLSearchParams({ p: page, ps: pageSize })
    if (query) {
      queryParams.append('query', query)
    }
    return service(`${url.all}?${queryParams.toString()}`, {
      method: 'GET',
    })
  }

  static async createDiscussion(title, content, type) {
    const data = { title, content: btoaUTF8(content), type }
    return service(url.create, {
      method: 'POST',
      data,
    })
  }

  static async deleteDiscussion(id) {
    return service(url.delete + '/' + id, {
      method: 'POST',
    })
  }

  static async verify(id, verified) {
    return service(`${url.verify}${id}?verified=${verified}`, {
      method: 'POST',
    })
  }
}
