import service from '../http'

const url = {
  login: '/auth/login',
  selectCourse: '/course/select/',
  logout: '/auth/logout',
  updataAvatar: '/account/avatar',
  teacher: '/account/teachers',
  query: '/admin/account/query',
  reset: '/admin/account/password/reset/',
  update: '/admin/account/update/',
  create: '/admin/account/create'
}

export default class Account {
  static async login(id, pwd) {
    const data = {
      buaaId: id,
      password: pwd,
    }
    return service(url.login, {
      method: 'POST',
      data,
    })
  }
  static async selectCourse(id) {
    return service(url.selectCourse + id, {
      method: 'POST',
    })
  }

  static async logout() {
    return service(url.logout, {
      method: 'POST'
    })
  }

  static async updataAvatar(file) {
    let data = new FormData()
    data.append('file', file)
    return service(url.updataAvatar, {
      method: 'POST',
      data
    })
  }

  static async getAllTeachers() {
    return service(url.teacher, {
      method: 'GET'
    })
  }

  static async queryAccounts(page, pageSize, query=null) {
    const queryParams = new URLSearchParams({ p: page, ps: pageSize })
    if (query) {
      if (query.buaaId) {
        queryParams.append('buaaId', query.buaaId)
      }
      if (query.name) {
        queryParams.append('name', query.name)
      }
      if (query.role !== null) {
        queryParams.append('role', query.role)
      }
    }
    return service(`${ url.query }?${ queryParams.toString() }`, {
      method: 'GET'
    })
  }

  static async resetPassword(id) {
    return service(url.reset + id, {
      method: 'POST'
    })
  }

  static async updateAccount(id, buaaId, name, school, gender, role) {
    return service(url.update + id, {
      method: 'POST',
      data: { buaaId, name, school, gender, role }
    })
  }

  static async createAccount(buaaId, name, school, gender, teacher, ta) {
    return service(url.create, {
      method: 'POST',
      data: { buaaId, name, school, gender, teacher, ta }
    })
  }
}
