import service from '../http'

const url = {
  'import': '/admin/student/import/async',
  'export': '/admin/student/export',
  query: '/admin/student/query'
}

export default class Student {
  static async importStudents(file, clean) {
    let data = new FormData()
    data.append('file', file)
    data.append('clean', clean)
    return service(url.import , {
      method: 'post',
      data
    })
  }

  static async exportStudents() {
    return service(url.export, {
      method: 'get',
      responseType: 'blob'
    })
  }

  static async queryStudents(page, pageSize) {
    return service(`${url.query}?p=${page}&ps=${pageSize}`, {
      method: 'get'
    })
  }
}
