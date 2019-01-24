import { getData } from './index'

export const getHotKeys = () => {
    return new Promise((resolve, reject) => {
        getData('/hotkey').then(res => {
            resolve(res.data)
        }, err => {
            reject(err)
        })
    })
}
// suggest里需要搜索的
export const getSearchRes = (query, page) => {
    return new Promise((resolve, reject) => {
        getData('/searching', {
            query, page
        }).then(res => {
            resolve(res.data)
        }, err => {
            reject(err)
        })
    })
}