import service from '../http'

const url = {
  all: '/announcement/query',
  one: '/announcement/query/',
  create: '/admin/announcement/create',
  delete: '/admin/announcement/delete/',
  setTopState: '/admin/announcement/update/',
  update: '/admin/announcement/update/',
}

export default class Notice {
  static async getOneNotice(id) {
    return service(url.one + id, {
      method: 'GET',
    })
  }
  static async getNoticeList() {
    return service(url.all, {
      method: 'GET',
    })
  }

  static async createNotice(title, content) {
    const data = { title, content, toppd: false }
    return service(url.create, {
      method: 'POST',
      data,
    })
  }

  static async deleteNotice(id) {
    return service(url.delete + id, {
      method: 'POST',
    })
  }

  // static async setTopState(id, state) {
  //   return service(url.setTopState + id, {
  //     method: 'POST',
  //     params: {
  //       isTopped: state,
  //     },
  //   })
  // }

  static async updateNotice(id, title, content, topped) {
    const data = { title, content, topped }
    return service(url.update + id, {
      method: 'POST',
      data,
    })
  }
}
