import service from '../http'

const url = {
  allProblems: '/admin/problem/select',
  updateProblem: '/admin/problem/update/',
  createProblem: '/admin/problem/create',
  problemDetail: '/admin/problem/query/',
  deleteProblem: '/admin/problem/delete/',
  config: '/admin/problem/download/',
  latestSubmission: '/submission/query/'
}

export default class Problem {
  static async getAllProblems() {
    return service(url.allProblems, {
      method: 'GET'
    })
  }

  static async updateProblem(id, problemData) {
    return service(url.updateProblem + id, {
      method: 'POST',
      data: problemData
    })
  }

  static async createProblem(title, file) {
    let formData = new FormData()
    formData.append('title', title)
    formData.append('description', 'java')
    formData.append('hidden', false)
    formData.append('file', file)
    return service(url.createProblem, {
      method: 'POST',
      data: formData
    })
  }

  static async getProblemDetail(id) {
    return service(url.problemDetail + id, {
      method: 'GET',
    })
  }

  static async deleteProblem(id) {
    return service(url.deleteProblem + id, {
      method: 'POST'
    })
  }

  static async getConfig(id) {
    return service(url.config + id, {
      method: 'GET',
      responseType: 'blob'
    })
  }

  static async getLatesSubmission(id) {
    return service(url.latestSubmission + id, {
      method: 'GET'
    })
  }
}
