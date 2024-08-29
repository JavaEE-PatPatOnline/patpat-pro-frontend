import service from '../http'

const url = {
  info: '/account/self',
  stuInfo: '/student/self',
  uploadAvatar: '/account/upload/avatar',
  pwd: '/account/password'
}

export default class User {
  static async getUserInfo() {
    return service(url.info, {
      method: 'get',
    })
  }

  static async getStuInfo() {
    return service(url.stuInfo, {
      method: 'get'
    })
  }

  static async uploadAvatar(avatar) {
    let data = new FormData()
    data.append('file', avatar)
    return service(url.uploadAvatar, {
      method: 'post',
      data,
    })
  }

  static async changePassword(oldPassword, newPassword) {
    return service(url.pwd, {
      method: 'put',
      data: {
        'old': oldPassword,
        'new': newPassword
      }
    })
  }
}
