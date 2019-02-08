import Axios from 'axios'

Axios.defaults.timeout = 10000
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8;'
// Axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'http://music.60late.com' : 'http://localhost:8020'
Axios.defaults.baseURL = 'http://music.60late.com'

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