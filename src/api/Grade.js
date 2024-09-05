import service from '../http'

const url = {
  query: '/admin/submission/query',
  downloadTestSubmission: '/admin/task/iter/download/',
  testDetail: '/admin/submission/query/',
}

export default class Grade {
  static async querySubmissions(page, pageSize, query=null) {
    const queryParams = new URLSearchParams({ p: page, ps: pageSize })
    if (query) {
      if (query.buaaId) {
        queryParams.append('buaaId', query.buaaId)
      }
      if (query.name) {
        queryParams.append('name', query.name)
      }
      if (query.problemId) {
        queryParams.append('problemId', query.problemId)
      }
      if (query.minScore) {
        queryParams.append('minScore', query.minScore)
      }
      if (query.maxScore) {
        queryParams.append('minScore', query.maxScore)
      }
    }
    return service(`${ url.query }?${ queryParams.toString() }`, {
      method: 'get'
    })
  }

  static async downloadTestSubmission(iterId, teacherId) {
    return service(url.downloadTestSubmission + iterId + '?teacherId=' + teacherId, {
      method: 'get',
      responseType: 'blob'
    })
  }

  static async getTestDetail(id) {
    return service(url.testDetail + id, {
      method: 'get'
    })
  }


}
