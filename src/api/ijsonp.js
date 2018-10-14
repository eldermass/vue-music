import ojsonp from 'jsonp'

export default function jsonp (url, params, options) {
  let param = paramToString(params)

  return new Promise((resolve, reject) => {
    ojsonp(url, Object.assign({}, options, {param}), (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function paramToString (params) {
  let newUrl = ''
  for (let [key, val] of Object.entries(params)) {
    val = val !== undefined ? val : ''
    newUrl += `&${key}=${encodeURIComponent(val)}`
  }
  return newUrl.substring(1)
}
