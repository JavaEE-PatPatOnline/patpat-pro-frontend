import service from '../http'
import { btoaUTF8 } from 'bestbase64utf8'

const url = {
  allIters: '/admin/task/iter/query',
  allVisibleIters: '/task/iter/query',
  iterDetail: '/task/iter/query/',
  updateIter: '/admin/task/iter/update/',
  createIter: '/admin/task/iter/create',
  deleteIter: '/admin/task/iter/delete/',
  linkedProblem: '/task/iter/problems/',
  linkProblem: '/admin/task/iter/problems/update/',
  score: '/task/iter/score/',
  submit: '/task/iter/submit/',
  download: '/task/iter/download/'
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
      method: 'GET'
    })
  }

  static async getAllVisibleIters() {
    return service(url.allVisibleIters, {
      method: 'GET'
    })
  }

  static async getIterDetail(id) {
    return service(url.iterDetail + id, {
      method: 'GET'
    })
  }

  static async updateIter(id, iterData) {
    iterData.content = btoaUTF8(iterData.content)
    return service(url.updateIter + id, {
      method: 'POST',
      data: iterData
    })
  }

  static async createIter(iterData) {
    iterData.content = btoaUTF8(iterData.content)
    return service(url.createIter, {
      method: 'POST',
      data: iterData
    })
  }

  static async deleteIter(id) {
    return service(url.deleteIter + id, {
      method: 'POST'
    })
  }

  static async getLinkedProblem(id) {
    return service(url.linkedProblem + id, {
      method: 'GET'
    })
  }

  static async linkProblem(id, problemId) {
    const data = { problemId }
    return service(url.linkProblem + id, {
      method: 'POST',
      data
    })
  }

  static async getIterScore(id) {
    return service(url.score + id, {
      method: 'GET'
    })
  }

  static async submit(id, submission) {
    return service(url.submit + id, {
      method: 'POST',
      data: submission
    })
  }

  static async downloadCode(id) {
    return service(url.download + id, {
      method: 'GET',
      responseType: 'blob'
    })
  }
}
