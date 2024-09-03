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

  static async queryStudents(page, pageSize, query=null) {
    const queryParams = new URLSearchParams({ p: page, ps: pageSize })
    if (query) {
      queryParams.append('buaaId', query.buaaId)
      queryParams.append('name', query.name)
      queryParams.append('teacherId', query.teacherId)
    }
    return service(`${url.query}?${queryParams.toString()}`, {
      method: 'get'
    })
  }
}
