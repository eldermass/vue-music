import { getData } from './index'

export const getLyric = (mid) => {
    return new Promise((resolve, reject) => {
        getData('/lyric', {
            mid
        }).then(res => {
            resolve(res.data)
        }, err => {
            reject(err)
        })
    })
}