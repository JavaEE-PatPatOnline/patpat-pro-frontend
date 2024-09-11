import service from '../http'

export default class Bucket {
  static async uploadFile(file) {
    let data = new FormData()
    data.append('file', file)

    return service('/bucket/upload/public', {
      method: 'POST',
      data
    })
  }
}
