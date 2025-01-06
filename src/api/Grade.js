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
  exportLabSubmissions: '/admin/task/lab/download/',
  groupScores: '/admin/group/query/scores',
  downloadGroupAssignment: '/admin/group/assignment/download/',
  scoreGroup: '/admin/group/score/',
  allAssignments: '/admin/group/assignment/download',
  allGroupScores: '/admin/statistics/groups'
}

export default class Grade {
  static async querySubmissions(page, pageSize, query = null) {
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
    return service(`${url.query}?${queryParams.toString()}`, {
      method: 'GET'
    })
  }

  static async downloadTestSubmission(iterId, teacherId) {
    return service(url.downloadTestSubmission + iterId + '?teacherId=' + teacherId, {
      method: 'GET',
      responseType: 'blob'
    })
  }

  static async getTestDetail(id) {
    return service(url.testDetail + id, {
      method: 'GET'
    })
  }

  static async getAllStudents() {
    return service(url.students, {
      method: 'GET'
    })
  }

  static async getAllTasks() {
    return service(url.tasks, {
      method: 'GET'
    })
  }

  static async getScoreList(id) {
    return service(url.score + id, {
      method: 'GET'
    })
  }

  static async downloadReport(id, studentId) {
    return service(url.downloadReport + id + '/' + studentId, {
      method: 'GET',
      responseType: 'blob'
    })
  }

  static async getScoreConfig() {
    return service(url.config, {
      method: 'GET'
    })
  }

  static async updateConfig(labScore, iterScore, projScore, latePercent) {
    return service(url.updateConfig, {
      method: 'POST',
      data: { labScore, iterScore, projScore, latePercent }
    })
  }

  static async exportAll() {
    return service(url.exportAll, {
      method: 'GET',
      responseType: 'blob'
    })
  }

  static async exportLabSubmissions(id, teacherId, progressCallback) {
    return service(url.exportLabSubmissions + id + '?teacherId=' + teacherId, {
      method: 'GET',
      responseType: 'blob',
      onDownloadProgress: progressCallback
    })
  }

  static async getGroupScores() {
    return service(url.groupScores, {
      method: 'GET'
    })
  }

  static async downloadGroupAssignment(id) {
    return service(url.downloadGroupAssignment + id, {
      method: 'GET',
      responseType: 'blob'
    })
  }

  static async scoreGroup(id, score) {
    return service(url.scoreGroup + id, {
      method: 'POST',
      data: { score }
    })
  }

  static async getAllAssignments(progressCallback) {
    return service(url.allAssignments, {
      method: 'GET',
      responseType: 'blob',
      onDownloadProgress: progressCallback
    })
  }

  static async getAllGroupScores() {
    return service(url.allGroupScores, {
      method: 'GET'
    })
  }
}
