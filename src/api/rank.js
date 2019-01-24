import { getData } from './index'

export const getRanklist = () => {
    return new Promise((resolve, reject) => {
        getData('/ranklist').then(res => {
            resolve(res.data)
        }, err => {
            reject(err)
        })
    })
}
// rank里的详情列表
export const getToplist = topid => {
    return new Promise((resolve, reject) => {
        getData('/ranklistsongs', { topid }).then(res => {
            resolve(res.data)
        }, err => {
            reject(err)
        })
    })
}