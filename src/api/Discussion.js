import service from '../http'

const url = {
  all: '/discussion/query',
  create: '/discussion/create',
  delete: '/discussion/delete',
  setTopState: '/discussion/top',
  // update: '/discussion/update',
  detail: '/discussion/',
  like: '/discussion/like',
  createComment: '/discussion/reply/create',
  deleteComment: '/discussion/reply/delete',
  likeComment: '/discussion/reply/like',
}

export default class Discussion {
  static async getDiscussionDetail(id) {
    return service(url.detail + '/' + id, {
      method: 'GET',
    })
  }
  static async likeDiscussion(id, state) {
    // console.log('点赞状态:', state)
    return service(url.like + '/' + id + '?like=' + state, {
      method: 'POST',
    })
  }
  static async createComment(discussionId, content, toId) {
    const data = { discussionId, content, toId }
    return service(url.createComment, {
      method: 'POST',
      data,
    })
  }

  static async deleteComment(id) {
    return service(url.deleteComment + '/' + id, {
      method: 'DELETE',
    })
  }
  static async likeComment(id, state) {
    console.log('状态' + !state)
    return service(url.likeComment + '/' + id + '?like=' + !state, {
      method: 'POST',
    })
  }

  static async getDiscussionList() {
    return service(url.all + '?p=1&ps=50', {
      method: 'GET',
    })
  }

  static async createDiscussion(title, content, type) {
    // const data = { title: title.value, content: content.value, type: '1' };
    const data = { title, content, type }
    return service(url.create, {
      method: 'POST',
      data,
    })
  }

  static async deleteDiscussion(id) {
    console.log('删除id :', id)
    return service(url.delete + '/' + id, {
      method: 'DELETE',
    })
  }

  static async setTopState(id, state) {
    return service(url.setTopState + '/' + id + '?top=' + state, {
      method: 'PUT',
    })
  }

  // static async updateDiscussion(id, title, content) {
  //   const data = { title, content }
  //   return service(url.update + '/' + id, {
  //     method: 'PUT',
  //     data,
  //   })
  // }
}
