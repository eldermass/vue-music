const https = require('https')

module.exports = async ctx => {
    let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
    let silders = await getList(url)
    if(silders.code == 0){
        ctx.state.data = silders.data
    }else{
        ctx.state.date = '抓取数据失败'
    }
}

function getList( url ){
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let urlData = ''
            res.on('data', data => {
                urlData += data
            })
            res.on('end', () => {
                let info = JSON.parse(urlData)
                resolve(info)
            })
        })
    })
}