const https = require('https')

module.exports = async ctx => {
  let res = await getVkey()
  ctx.state.data = res
}

function getVkey () {
  let data = {
    'req': {
      'module': 'CDN.SrfCdnDispatchServer',
      'method': 'GetCdnDispatch',
      'param': {
        'guid': '4840101680',
        'calltype': 0,
        'userip': ''
      }
    },
    'req_0': {
      'module': 'vkey.GetVkeyServer',
      'method': 'CgiGetVkey',
      'param': {
        'guid': '4840101680',
        'songmid': ['003teD5n44Tqbm'],
        'songtype': [0],
        'uin': '0',
        'loginflag': 1,
        'platform': '20'
      }
    },
    'comm': {
      'uin': 0,
      'format': 'json',
      'ct': 20,
      'cv': 0
    }
  }
  let url = `https://u.y.qq.com/cgi-bin/musicu.fcg?callback=getplaysongvkey9222327017187313&g_tk=5381&jsonpCallback=getplaysongvkey9222327017187313&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&data=${encodeURI(JSON.stringify(data))}`
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let allData = ''
      res.on('data', data => {
        allData += data
      })
      res.on('end', () => {
        resolve(allData)
      })
    })
  })
}