import service from '../http'

const url = {
  all: '/admin/course/material/query',
  upload: '/admin/course/material/upload',
  update: '/admin/course/material/update/',
  delete: '/admin/course/material/delete/'
}

export default class Material {
  static async getAllMaterials() {
    return service(url.all, {
      method: 'get'
    })
  }

  static async uploadMaterial(file, comment) {
    let data = new FormData()
    data.append('file', file)
    data.append('comment', comment)
    return service(url.upload, {
      method: 'post',
      data
    })
  }
  
  static async updateMaterial(id, file, comment) {
    let data = new FormData()
    data.append('file', file)
    data.append('comment', comment)
    return service(url.update + id, {
      method: 'put',
      data
    })
  }

  static async deleteMaterial(id) {
    return service(url.delete + id, {
      method: 'delete'
    })
  }
  
}
