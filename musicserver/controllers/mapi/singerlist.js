const https = require('https')

/* eslint-disable */
module.exports = async ctx => {
    let { page, area, sex, genre, index, all } = ctx.request.query
    let msg = {
        "comm": {
            "ct": 24,
            "cv": 10000
        },
        "singerList": {
            "module": "Music.SingerListServer",
            "method": "get_singer_list",
            "param": {
                "area": area ? parseInt(area) : -100,
                "sex": sex ? parseInt(sex) : -100,
                "genre": genre ? parseInt(genre) : -100,
                "index": index ? parseInt(index) : -100,
                "sin": page ? 80 * (page - 1) : 0,
                "cur_page": page ? parseInt(page) : 1
            }
        }
    }
    if (all) {
        let allsinger = []
        for (let i = 1; i <= 27; i++) {
            msg.singerList.param.index = i
            msg.singerList.param.genre = 1
            msg.singerList.param.area = 200
            let res = await getData(msg)
            let list = JSON.parse(res).singerList.data
            if (list.singerlist.length)
                allsinger.push(list)
            else {
                msg.singerList.param.genre = -100
                msg.singerList.param.area = -100
                let moreres = await getData(msg)
                allsinger.push(JSON.parse(moreres).singerList.data)
            }
        }
        ctx.state = {
            data: allsinger
        }
    } else {
        let res = await getData(msg)
        ctx.state = {
            data: JSON.parse(res).singerList.data
        }
    }
}

function getData(msg) {
    msg = encodeURI(JSON.stringify(msg))
    let url = `https://u.y.qq.com/cgi-bin/musicu.fcg?g_tk=5381&loginUin=0&hostUin=0&format=json
    &inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&data=${msg}`

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