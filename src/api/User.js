import service from '../http'

const url = {
  info: '/account/self',
  uploadAvatar: '/account/upload/avatar',
}

export default class User {
  static async getUserInfo() {
    return service(url.info, {
      method: 'get',
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
}
