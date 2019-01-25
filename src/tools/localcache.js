import Storage from './storage'

// 喜爱歌曲，搜索历史，播放历史
const MAX_SEARCH_LENGTH = 50
const MAX_PLAY_HISTORY = 200
const localSearch = new Storage('search_history')
const localFavorite = new Storage('favorite_list')
const localPlayhistory = new Storage('play_history')

// 加载时
export function loadSearch () {
    return localSearch.get()
}
export function loadPlayHistory () {
    return localPlayhistory.get()
}
export function loadFavorite () {
    return localFavorite.get()
}
// 播放相关
export function cachePlayHistory (song) {
    let oldSongs = localPlayhistory.get()
    let newSongs = insertArray(oldSongs, song, MAX_PLAY_HISTORY, (olditem, newitem) => {
        return olditem.id === newitem.id
    })
    localPlayhistory.set(newSongs)
    return newSongs
}

// 喜欢相关
export function cacheFavorite (song) {
    let oldSongs = localFavorite.get()
    let newSongs = insertArray(oldSongs, song, 500, (olditem, newitem) => {
        return olditem.id === newitem.id
    })
    localFavorite.set(newSongs)
    return newSongs
}

export function delFavorite (song) {
    let oldSongs = localFavorite.get()
    let newSongs = deleteFromArray(oldSongs, song, (olditem, newitem) => {
        return olditem.id === newitem.id
    })
    localFavorite.set(newSongs)
    return newSongs
}

// 搜索相关
export function saveSearch (query) {
    let oldArray = localSearch.get()
    let newArray = insertArray(oldArray, query, MAX_SEARCH_LENGTH)
    localSearch.set(newArray)
    return newArray
}

export function deleteSearch (query) {
    let oldArray = localSearch.get()
    let newArray = deleteFromArray(oldArray, query)
    localSearch.set(newArray)
    return newArray
}

export function clearSearch () {
    localSearch.set([])
    return []
}

function insertArray (arr, value, maxlen, fn) {
    let index = arr.findIndex(val => {
      return fn ? fn(val, value) : val === value
    })
    if (index > -1) {
      arr.splice(index, 1)
    }
    arr.unshift(value)

    if (maxlen && maxlen < arr.length) {
      arr.pop()
    }
    return arr
}

function deleteFromArray (arr, query, fn) {
    let fdIndex = arr.findIndex(val => {
        return fn ? fn(val, query) : val === query
    })
    if (fdIndex > -1) {
        arr.splice(fdIndex, 1)
    }
    return arr
}