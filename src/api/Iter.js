import service from '../http'

const url = {
  allIters: '/admin/task/iter/query',
  allVisibleIters: '/task/iter/query',
  iterDetail: '/task/iter/query/',
  updateIter: '/admin/task/iter/update/',
  createIter: '/admin/task/iter/create',
  deleteIter: '/admin/task/iter/delete/',
  linkedProblem: '/task/iter/problems/',
  linkProblem: '/admin/task/iter/problems/update/'
}

export default class Iter {
  static async getIters(isAdmin) {
    if (isAdmin) {
      return this.getAllIters()
    } else {
      return this.getAllVisibleIters()
    }
  }

  static async getAllIters() {
    return service(url.allIters, {
      method: 'get'
    })
  }
  
  static async getAllVisibleIters() {
    return service(url.allVisibleIters, {
      method: 'get'
    })
  }

  static async getIterDetail(id) {
    return service(url.iterDetail + id, {
      method: 'get'
    })
  }

  static async updateIter(id, iterData) {
    return service(url.updateIter + id, {
      method: 'put',
      data: iterData
    })
  }

  static async createIter(iterData) {
    return service(url.createIter, {
      method: 'post',
      data: iterData
    })
  }

  static async deleteIter(id) {
    return service(url.deleteIter + id, {
      method: 'delete'
    })
  }

  static async getLinkedProblem(id) {
    return service(url.linkedProblem + id, {
      method: 'get'
    })
  }

  static async linkProblem(id, problemId) {
    const data = { problemId }
    return service(url.linkProblem + id, {
      method: 'post',
      data
    })
  }
}
