import service from '../http'

const url = {
  login: '/auth/login',
  selectCourse: '/course/select/',
  logout: '/auth/logout',
  updataAvatar: '/account/avatar'
}

export default class Account {
  static async login(id, pwd) {
    const data = {
      buaaId: id,
      password: pwd,
    }
    return service(url.login, {
      method: 'post',
      data,
    })
  }
  static async selectCourse(id) {
    return service(url.selectCourse + id, {
      method: 'post',
    })
  }

  static async logout() {
    return service(url.logout, {
      method: 'post'
    })
  }

  static async updataAvatar(file) {
    let data = new FormData()
    data.append('file', file)
    return service(url.updataAvatar, {
      method: 'post',
      data
    })
  }
}
