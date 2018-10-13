const https = require('https')

module.exports = async ctx => {
    let {id, page} = ctx.request.query
    page = page ? parseInt(page) : 0
    id = parseInt(id)
    let res = await getData(`https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?singerid=${id}&g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5page&needNewCode=1&order=listen&from=h5&num=15&begin=${page*15}&_=1538211761349`)

    ctx.state.data = res.data
}

function getData(url){
    return new Promise((resolve, reject) => {
        https.get(url, res => {
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