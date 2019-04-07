const https = require('https')

module.exports = async ctx => {
    let {query, page} = ctx.request.query
    let res = await getSearchData(encodeURI(query), page)

    ctx.state.data = JSON.parse(res).data
}
function getSearchData(query, page) {
    page = page || 1
    let options = {
        hostname:'c.y.qq.com',
        path:`/soso/fcgi-bin/search_for_qq_cp?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&w=${query}&zhidaqu=1&catZhida=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&perpage=20&n=20&p=${page}&remoteplace=txt.mqq.all&_=1538901902499`,
        headers:{
            'Accept':'*/*',
            'Accept-Encoding':'utf-8',
            'Accept-Language':'zh-CN,zh;q=0.8',
            'Connection':'keep-alive',
            'Host':'c.y.qq.com',
            'Referer':'https://y.qq.com/m/index.html'
        }
    }
    return new Promise((resolve, reject) => {
        https.get(options, res => {
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