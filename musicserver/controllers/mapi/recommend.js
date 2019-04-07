const https = require('https')

module.exports = async ctx => {
    let data = await getList()
    ctx.state.data = data
}

function getList () {
    var option={
        hostname:'c.y.qq.com',
        path:'/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg?picmid=1&rnd=0.2815167374630836&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&categoryId=10000000&sortId=5&sin=0&ein=29',
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
        https.get(option, res => {
            let allData = ''
            res.on('data', data => {
                allData += data
            })
            res.on('end', () => {
                resolve(JSON.parse(allData))
            })
        })
    })
}