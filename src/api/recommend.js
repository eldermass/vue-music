import { getData } from './index'

export const getSlider = () => {
    return new Promise((resolve, reject) => {
        getData('/pageslider').then(res => {
            resolve(res.data)
        }, err => {
            reject(err)
        })
    })
}

export const getRecommend = () => {
    return new Promise((resolve, reject) => {
        getData('/recommend').then(res => {
            resolve(res.data)
        }, err => {
            reject(err)
        })
    })
}

export const getDiscList = (dissid) => {
    return new Promise((resolve, reject) => {
        getData('/disclist', { dissid }).then(res => {
            resolve(res.data)
        }, err => {
            reject(err)
        })
    })
}