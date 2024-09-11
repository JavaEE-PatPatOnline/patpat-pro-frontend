import service from '../http'

const url = {
  'import': '/admin/student/import',
  'export': '/admin/student/export',
  query: '/admin/student/query'
}

export default class Student {
  static async importStudents(file, clean) {
    let data = new FormData()
    data.append('file', file)
    data.append('clean', clean)
    return service(url.import , {
      method: 'POST',
      data
    })
  }

  static async exportStudents() {
    return service(url.export, {
      method: 'GET',
      responseType: 'blob'
    })
  }

  static async queryStudents(page, pageSize, query=null) {
    const queryParams = new URLSearchParams({ p: page, ps: pageSize })
    if (query) {
      queryParams.append('buaaId', query.buaaId)
      queryParams.append('name', query.name)
      if (query.teacherId) {
        queryParams.append('teacherId', query.teacherId)
      }
    }
    return service(`${url.query}?${queryParams.toString()}`, {
      method: 'GET'
    })
  }
}
