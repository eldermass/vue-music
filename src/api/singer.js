import { getData } from './index'

export const getSingerList = (opt) => {
    return new Promise((resolve, reject) => {
        getData('/singerlist', opt).then(res => {
            resolve(res.data)
        }, err => {
            reject(err)
        })
    })
}

export const getSingerSongs = (id, page) => {
    return new Promise((resolve, reject) => {
        getData('/singersongs', {
            id, page
        }).then(res => {
            resolve(res.data)
        }, err => {
            reject(err)
        })
    })
}
