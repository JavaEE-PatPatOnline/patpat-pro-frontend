export default function download(response, defaultFilename) {
  let data = response.data
  let blob = new Blob([data], { type: 'application/octet-stream' })

  const contentDisposition = response.headers['content-disposition']
  let filename = defaultFilename // Fallback filename

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+)"/);
    if (match && match.length === 2) {
      filename = match[1]
    }
  }
  const downloadUrl = URL.createObjectURL(blob)
  const link = document.createElement('a') // 创建一个 a 标签
  link.href = downloadUrl // 设置 a 标签的 url
  link.download = decodeURIComponent(filename) // 设置文件名
  document.body.appendChild(link) // 将 a 标签添加到 DOM
  link.click() // 模拟点击，开始下载
  document.body.removeChild(link) // 下载完成后移除 a 标签
}