const https = require('https')

module.exports = async ctx => {
    let {dissid} = ctx.request.query
    dissid = dissid || 3605876950
    let path = `/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0&disstid=${dissid}&format=json&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`

    let res = await getData(path, dissid)
    
    ctx.state.data = JSON.parse(res)
}

function getData(path,dissid) {
    let option = {
            hostname: 'c.y.qq.com',
            path,
            headers:{
                'Accept':'*/*',
                'Accept-Encoding':'utf-8',
                'Accept-Language':'zh-CN,zh;q=0.8',
                'Connection':'keep-alive',
                'Host':'c.y.qq.com',
                'Referer':`https://y.qq.com/n/yqq/playsquare/${dissid}.html`
            }
        }
    return new Promise((resolve, reject) => {
        https.get(option, res => {
            let allData = ''
            
            res.on('data', data => {
                allData += data
            })
            res.on('end', () => {
                resolve(allData)
            })
            // let allData = []
            // res.on('data', data => {
            //     allData.push(data)
            // })
            // res.on('end', () => {
            //     resolve(Buffer.concat(allData))
            // })
        })
    })
}