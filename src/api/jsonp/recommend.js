import jsonp from './ijsonp'
import {commonParams, options} from './config'

export function getSlider () {
  let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  return new Promise((resolve, reject) => {
    jsonp(url, commonParams, options).then(res => {
      resolve(res)
    }, err => {
      reject(err)
    })
  })
}
