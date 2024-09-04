import service from '../http'

const url = {
  allCourses: '/course/all',
  selectCourse: '/course/select/',
  update: '/admin/course/update',
  delete: '/admin/course/delete/',
  create: '/admin/course/create'
}

export default class Course {
  static async getAllCourses() {
    return service(url.allCourses, {
      method: 'get'
    })
  }
  
  static async selectCourse(id) {
    return service(url.selectCourse + id, {
      method: 'post'
    })
  }

  static async updateCourse(code, name, semester, active) {
    return service(url.update, {
      method: 'put',
      data: {
        code, name, semester, active
      }
    })
  }

  static async deleteCourse(id) {
    return service(url.delete + id, {
      method: 'delete'
    })
  }

  static async createCourse(code, name, semester, active) {
    return service(url.create, {
      method: 'post',
      data: {
        code, name, semester, active
      }
    })
  }
}
