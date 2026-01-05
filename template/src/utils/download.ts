/**
 * 文件下载工具函数
 */

/**
 * 通过 Blob 对象下载文件
 * @param blob Blob 对象
 * @param filename 文件名
 */
export const downloadBlob = (blob: Blob, filename: string, type?: string) => {
  if (type) {
    blob = new Blob([blob], { type })
  }
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.target = '_blank'
  link.setAttribute('download', filename || '')

  console.log(link, filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
