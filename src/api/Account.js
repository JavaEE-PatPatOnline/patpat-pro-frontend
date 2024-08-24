import service from '../http'

const url = {
  login: '/auth/login',
  selectCourse: '/course/select/',
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
}
