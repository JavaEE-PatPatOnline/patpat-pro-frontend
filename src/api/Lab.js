import service from '../http'

const url = {
  allLabs: '/admin/task/lab/query',
  allVisibleLabs: '/task/lab/query',
  labDetail: '/task/lab/query/',
  updateLab: '/admin/task/lab/update/',
  createLab: '/admin/task/lab/create',
  deleteLab: '/admin/task/lab/delete/',
  submit: '/task/lab/submit/',
  score: '/task/lab/score/',
  report: '/task/lab/download/'
}

export default class Lab {
  static async getLabs(isAdmin) {
    if (isAdmin) {
      return this.getAllLabs()
    } else {
      return this.getAllVisibleLabs()
    }
  }

  static async getAllLabs() {
    return service(url.allLabs, {
      method: 'GET'
    })
  }
  
  static async getAllVisibleLabs() {
    return service(url.allVisibleLabs, {
      method: 'GET'
    })
  }

  static async getLabDetail(id) {
    return service(url.labDetail + id, {
      method: 'GET'
    })
  }

  static async updateLab(id, labData) {
    return service(url.updateLab + id, {
      method: 'POST',
      data: labData
    })
  }

  static async createLab(labData) {
    return service(url.createLab, {
      method: 'POST',
      data: labData
    })
  }

  static async deleteLab(id) {
    return service(url.deleteLab + id, {
      method: 'POST'
    })
  }

  static async submitReport(id, file) {
    let data = new FormData()
    data.append('file', file)

    return service(url.submit + id, {
      method: 'POST',
      data
    })
  }

  static async getScore(id) {
    return service(url.score + id, {
      method: 'GET'
    })
  }

  static async getReport(id) {
    return service(url.report + id, {
      method: 'GET',
      responseType: 'blob'
    })
  }
}
