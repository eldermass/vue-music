const https = require('https')
const Base64 = require('js-base64').Base64
module.exports = async ctx => {
    let {mid} = ctx.request.query
    let res = await getData(mid ? mid : '003zblDH0Lgu7p')
    lrc = res.replace(/^readIrc\(({.+})\)$/, ($1, $2) => {
        return $2
    })
    ctx.state.data =  Base64.decode(JSON.parse(lrc).lyric)
}


function getData(mid) {
    const config = {
        hostname: 'c.y.qq.com',
        path: `/lyric/fcgi-bin/fcg_query_lyric_new.fcg?callback=readIrc&pcachetime=1538625060441&songmid=${mid}&g_tk=5381&jsonpCallback=readIrc&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`,
        headers:{
            'Accept':'*/*',
            'Accept-Encoding':'utf-8',
            'Accept-Language':'zh-CN,zh;q=0.8',
            'Connection':'keep-alive',
            'Host':'c.y.qq.com',
            'Referer':'https://c.y.qq.com'
          }
    }
    return new Promise((resolve, reject) => {
        https.get(config, res => {
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