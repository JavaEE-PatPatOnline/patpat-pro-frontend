import service from '../http'

const url = {
  currentGroup: '/group',
  allGroups: '/group/query',
  joinGroup: '/group/join/',
  config: '/group/config',
  weight: '/group/weight/',
  kickMember: '/group/kick/',
  dismiss: '/group/dismiss',
  quit: '/group/quit',
  update: '/group/update',
  submit: '/group/assignment/submit',
  download: '/group/assignment/download',
  updateConfig: '/admin/group/config/update',
  create: '/group/create',
  'export': '/admin/group/export'
}

export default class Group {
  static async getCurrentGroup() {
    return service(url.currentGroup, {
      method: 'get'
    })
  }

  static async getAllGroups() {
    return service(url.allGroups, {
      method: 'get'
    })
  }

  static async joinGroup(id) {
    return service(url.joinGroup + id, {
      method: 'post'
    })
  }

  static async getGroupConfig() {
    return service(url.config, {
      method: 'get'
    })
  }

  static async updateWeight(id, weight) {
    return service(url.weight + id, {
      method: 'post',
      data: { weight }
    })
  }

  static async kickMember(id) {
    return service(url.kickMember + id, {
      method: 'post'
    })
  }

  static async dismissGroup() {
    return service(url.dismiss, {
      method: 'delete'
    })
  }

  static async quitGroup() {
    return service(url.quit, {
      method: 'post'
    })
  }

  static async updateGroup(name, locked) {
    const groupData = {
      name, locked, description: ''
    }
    return service(url.update, {
      method: 'put',
      data: groupData
    })
  }

  static async submitAssignment(data) {
    return service(url.submit, {
      method: 'post',
      data
    })
  }

  static async downloadAssignment() {
    return service(url.download, {
      method: 'get',
      responseType: 'blob'
    })
  }

  static async updateGroupConfig(configData) {
    return service(url.updateConfig, {
      method: 'put',
      data: configData
    })
  }

  static async createGroup(name) {
    return service(url.create, {
      method: 'post',
      data: {
        name, description: ''
      }
    })
  }

  static async exportGroups() {
    return service(url.export, {
      method: 'get',
      responseType: 'blob'
    })
  }
}
