import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: 'http://121.40.253.198:8080',
  timeout: 10000,
})

request.interceptors.request.use((config) => {
  if (config.data) {
    config.data = {
      ...config.data,
    }
  }
  return config
})

request.interceptors.response.use(
  async (res) => {
    return res.data
  },
  (err) => {
    let message = ''
    switch (err.response.status) {
      case 400:
        message = '请求出错'
        break
      case 401:
        message = '未授权，请登录'
        break
      case 403:
        message = '拒绝访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 408:
        message = '请求超时'
        break
      default:
        message = '网络出错'
        break
    }
    ElMessage({
      type: 'error',
      message,
    })
    return Promise.reject(err)
  },
)

export default request
