const https = require('https')

module.exports = async ctx => {
    let res= await getHotKey()
    ctx.state.data = JSON.parse(res).data
}
function getHotKey() {
    let url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1538896634839'
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