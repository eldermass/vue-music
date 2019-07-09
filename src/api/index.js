import Axios from 'axios'

Axios.defaults.timeout = 10000
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8;'
// Axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'http://music.60late.com' : 'http://localhost:8020/mapi'
// 默认音乐数据api的根路径
Axios.defaults.baseURL = process.env.API_URL ? process.env.API_URL + '/mapi' : '/mapi'

Axios.interceptors.request.use(config => {
  // console.log(config)
  return config
}, err => {
  console.log('post error')
  return Promise.reject(err)
})

Axios.interceptors.response.use(res => {
  if (!res.data) {
    return Promise.resolve(res)
  }
  return res
}, err => {
  console.log('response error')
  return Promise.reject(err)
})
// 非音乐api请求，用其他实例
// eslint-disable-next-line
const userInstance = Axios.create({
  baseURL: process.env.API_URL + '/user',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});

export function getData (url, params) {
  return new Promise((resolve, reject) => {
    let param = {params}
    Axios.get(url, param).then(res => {
      // setTimeout(() => {
        resolve(res.data)
      // }, 1000)
    }, err => {
      reject(err)
    })
  })
}
export function postData (url, params) {
  return new Promise((resolve, reject) => {
    Axios.post(url, params).then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}
export default {
  postData, getData
}