import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import { user, envMode } from '@/utils'
import { message } from 'ant-design-vue'

// 定义响应数据的接口
interface ResponseData {
  code: number
  data: any
  message: string
}

// 定义传参方式
type RequestParamsType = 'query' | 'body' | 'params'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    config.headers.token = user.userKey
    return config
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    console.error('请求错误：', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: any) => {
    const { data, headers } = response
    // 不是json格式，直接返回数据
    if (headers['content-type'] !== 'application/json') {
      return data
    }
    if (data.status === 0) {
      // 会话过期，重新登录
      switch (envMode) {
        case 'devmaster':
        case 'devtencentCloud':
          message.error('请查看控制台打印信息')
          console.log(
            `%c当前为本地连接线上【${envMode}】环境，跨项目的 localStorage 无法共享，请在线上【${envMode}】环境登录后，将缓存中的 newUserInfo 复制到本地，然后刷新本页面`,
            'color: #04e8e8',
          )
          break

        case 'prodmaster':
          message.error('会话过期，请重新登录')
          window.open('/school-dev/home/app.html#/login', '_self')
          break
        case 'prodtencentCloud':
          message.error('会话过期，请重新登录')
          window.open('/school-evaluation/home/app.html?v=1#/login', '_self')
          break
        default:
          break
      }

      // router.push('/login')
      return
    } else if (data.status === 1) {
      return data
    } else {
      console.error(data)
      message.error(data.message)
      return Promise.reject(data)
    }
  },
  (error: AxiosError<ResponseData>) => {
    console.error(error)
    message.error(error.message)
    return Promise.reject(error)
  },
)

// 处理请求参数
function handleRequestParams(params: any, type: RequestParamsType): AxiosRequestConfig {
  if (!params) return {}

  switch (type) {
    case 'query':
      return { params }
    case 'body':
      return { data: params }
    default:
      return { params }
  }
}

// 创建请求对象
const request = {
  get(
    url: string,
    params?: any,
    paramsType: RequestParamsType = 'query',
    config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'params' | 'data'>,
  ): Promise<any> {
    return service.request({
      method: 'GET',
      url,
      ...handleRequestParams(params, paramsType),
      ...config,
    })
  },

  post(
    url: string,
    params?: any,
    paramsType: RequestParamsType = 'body',
    config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'params' | 'data'>,
  ): Promise<any> {
    return service.request({
      method: 'POST',
      url,
      ...handleRequestParams(params, paramsType),
      ...config,
    })
  },

  put(
    url: string,
    params?: any,
    paramsType: RequestParamsType = 'body',
    config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'params' | 'data'>,
  ): Promise<any> {
    return service.request({
      method: 'PUT',
      url,
      ...handleRequestParams(params, paramsType),
      ...config,
    })
  },

  delete(
    url: string,
    params?: any,
    paramsType: RequestParamsType = 'query',
    config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'params' | 'data'>,
  ): Promise<any> {
    return service.request({
      method: 'DELETE',
      url,
      ...handleRequestParams(params, paramsType),
      ...config,
    })
  },
}

export default request
