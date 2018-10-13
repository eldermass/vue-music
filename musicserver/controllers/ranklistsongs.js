const https = require('https')

module.exports = async ctx => {
    let {topid} = ctx.request.query
    let res = await getToplist(topid)
    ctx.state.data = JSON.parse(res)
}

function getToplist (id) {
    let url = `https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid=${id}&_=1538825333650`
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