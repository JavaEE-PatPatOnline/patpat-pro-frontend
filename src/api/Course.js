import service from '../http'

const url = {
  allCourses: '/course/all',
  selectCourse: '/course/select/'
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
}
