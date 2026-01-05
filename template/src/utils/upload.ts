import request from '@/utils/request'
import { message } from 'ant-design-vue'

// 确保安全地获取文件扩展名
const getFileExtension = (fileName: string): string => {
  try {
    if (!fileName || !fileName.includes('.')) {
      return ''
    }
    return fileName.split('.').pop()?.toLowerCase() || ''
  } catch {
    return ''
  }
}

// 获取上传凭证
export const getUploadToken = (suffix: string) => {
  return request.get(`/cloud/common/file/getToken?bucketType=0&fileType=${suffix}`)
}

// 上传文件
export const uploadFile = async (file: File, onProgress?: (progress: number) => void) => {
  // 自动从文件名提取后缀
  const suffix = getFileExtension(file.name)
  if (!suffix) {
    message.error('无法识别文件类型')
    // return
  }

  const res: any = await getUploadToken(suffix)
  if (res.status !== 1) {
    message.error(res.message)
    return
  }

  const formData = new FormData()
  formData.append('token', res.result.uptoken)
  formData.append('file', file)
  formData.append('key', res.result.fileKey)

  return request.post(res.result.uploadUrl, formData, 'body', {
    headers: {
      'Content-Type': 'multipart/form-data', // 设置 Content-Type
    },
    timeout: 60000,
    onUploadProgress: (progressEvent: any) => {
      if (onProgress) {
        // 计算上传进度百分比
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
        onProgress(progress) // 调用回调函数传递进度
      }
    },
  })
}
