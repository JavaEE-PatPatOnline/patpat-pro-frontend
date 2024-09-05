import service from '../http'

const url = {
  query: '/admin/submission/query',
  downloadTestSubmission: '/admin/task/iter/download/',
  testDetail: '/admin/submission/query/',
  allTask: '/admin/statistics/tasks',
  students: '/admin/statistics/students',
  tasks: '/admin/statistics/tasks',
  score: '/admin/statistics/tasks/',
  downloadReport: '/admin/task/lab/download/',
  config: '/admin/statistics/config',
  updateConfig: '/admin/statistics/config/update',
  exportAll: '/admin/statistics/export',
  exportLabSubmissions: '/admin/task/lab/download/'
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
        queryParams.append('maxScore', query.maxScore)
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

  static async getAllStudents() {
    return service(url.students, {
      method: 'get'
    })
  }

  static async getAllTasks() {
    return service(url.tasks, {
      method: 'get'
    })
  }

  static async getScoreList(id) {
    return service(url.score + id, {
      method: 'get'
    })
  }

  static async downloadReport(id, studentId) {
    return service(url.downloadReport + id + '/' + studentId, {
      method: 'get',
      responseType: 'blob'
    })
  }

  static async getScoreConfig() {
    return service(url.config, {
      method: 'get'
    })
  }

  static async updateConfig(labScore, iterScore, projScore) {
    return service(url.updateConfig, {
      method: 'put',
      data: { labScore, iterScore, projScore }
    })
  }

  static async exportAll() {
    return service(url.exportAll, {
      method: 'get',
      responseType: 'blob'
    })
  }

  static async exportLabSubmissions(id, teacherId) {
    return service(url.exportLabSubmissions + id + '?teacherId=' + teacherId, {
      method: 'get',
      responseType: 'blob'
    })
  }
}
