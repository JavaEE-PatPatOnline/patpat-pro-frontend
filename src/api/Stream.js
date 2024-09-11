import service from '../http'

export default class Stream {
  static async getWebSocketURL() {
    return service('/stream/websocket', {
      method: 'GET'
    })
  }
}
