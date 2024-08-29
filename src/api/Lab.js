import service from '../http'

const url = {
  allLabs: '/admin/task/lab/query',
  allVisibleLabs: '/task/lab/query',
  labDetail: '/task/lab/query/',
  updateLab: '/admin/task/lab/update/',
  createLab: '/admin/task/lab/create',
  deleteLab: '/admin/task/lab/delete/',
  submit: '/task/lab/submit/'
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
      method: 'get'
    })
  }
  
  static async getAllVisibleLabs() {
    return service(url.allVisibleLabs, {
      method: 'get'
    })
  }

  static async getLabDetail(id) {
    return service(url.labDetail + id, {
      method: 'get'
    })
  }

  static async updateLab(id, labData) {
    return service(url.updateLab + id, {
      method: 'put',
      data: labData
    })
  }

  static async createLab(labData) {
    return service(url.createLab, {
      method: 'post',
      data: labData
    })
  }

  static async deleteLab(id) {
    return service(url.deleteLab + id, {
      method: 'delete'
    })
  }

  static async submitReport(id, file) {
    let data = new FormData()
    data.append('file', file)

    return service(url.submit + id, {
      method: 'post',
      data
    })
  }
}
