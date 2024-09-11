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
  'export': '/admin/group/export',
  rogue: '/admin/group/query/rogue'
}

export default class Group {
  static async getCurrentGroup() {
    return service(url.currentGroup, {
      method: 'GET'
    })
  }

  static async getAllGroups() {
    return service(url.allGroups, {
      method: 'GET'
    })
  }

  static async joinGroup(id) {
    return service(url.joinGroup + id, {
      method: 'POST'
    })
  }

  static async getGroupConfig() {
    return service(url.config, {
      method: 'GET'
    })
  }

  static async updateWeight(id, weight) {
    return service(url.weight + id, {
      method: 'POST',
      data: { weight }
    })
  }

  static async kickMember(id) {
    return service(url.kickMember + id, {
      method: 'POST'
    })
  }

  static async dismissGroup() {
    return service(url.dismiss, {
      method: 'POST'
    })
  }

  static async quitGroup() {
    return service(url.quit, {
      method: 'POST'
    })
  }

  static async updateGroup(name, locked) {
    const groupData = {
      name, locked, description: ''
    }
    return service(url.update, {
      method: 'POST',
      data: groupData
    })
  }

  static async submitAssignment(data) {
    return service(url.submit, {
      method: 'POST',
      data
    })
  }

  static async downloadAssignment() {
    return service(url.download, {
      method: 'GET',
      responseType: 'blob'
    })
  }

  static async updateGroupConfig(configData) {
    return service(url.updateConfig, {
      method: 'POST',
      data: configData
    })
  }

  static async createGroup(name) {
    return service(url.create, {
      method: 'POST',
      data: {
        name, description: ''
      }
    })
  }

  static async exportGroups() {
    return service(url.export, {
      method: 'GET',
      responseType: 'blob'
    })
  }

  static async getRogueStudents() {
    return service(url.rogue, {
      method: 'GET'
    })
  }
}
