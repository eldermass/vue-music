// import storage from './storage'

// const SEARCH_KEY = 'savedSearch'
// const MAX_LENGTH = 15

// const PLAY_KEY = 'playHistory'
// const PLAY_MAX_LENGTH = 200

// const FAVORITE_KEY = 'favorite_list'

// function insertArray (arr, value, maxlen) {
//   let index = arr.findIndex(val => {
//     return val === value
//   })
//   if (index > -1) {
//     arr.splice(index, 1)
//   }
//   arr.unshift(value)

//   if (maxlen && maxlen < arr.length) {
//     arr.pop()
//   }
//   return arr
// }

// function deleteFromArray (arr, query) {
//   let fdIndex = arr.findIndex(val => {
//     return val === query
//   })
//   if (fdIndex > -1) {
//     arr.splice(fdIndex, 1)
//   }
//   return arr
// }
// export function saveSearch (query) {
//   let oldArray = storage.get(SEARCH_KEY) ? storage.get(SEARCH_KEY) : []
//   let newArray = insertArray(oldArray, query, MAX_LENGTH)
//   storage.set(SEARCH_KEY, newArray)
//   return newArray
// }

// export function deleteSearch (query) {
//   let oldArray = storage.get(SEARCH_KEY) ? storage.get(SEARCH_KEY) : []
//   let newArray = deleteFromArray(oldArray, query)
//   storage.set(SEARCH_KEY, newArray)
//   return newArray
// }
// export function clearSearch () {
//   storage.set(SEARCH_KEY, [])
//   return []
// }

// export function loadSearch () {
//   return storage.get(SEARCH_KEY)
// }

// function insertSong (songList, song, maxlen) {
//   let fsIndex = songList.findIndex(item => {
//     return item.id === song.id
//   })
//   if (fsIndex > -1) {
//     songList.splice(fsIndex, 1)
//   }
//   songList.unshift(song)
//   if (maxlen && maxlen < songList.length) {
//     songList.pop()
//   }
//   return songList
// }
// export function cachePlayHistory (song) {
//   let oldSongs = storage.get(PLAY_KEY) ? storage.get(PLAY_KEY) : []
//   let newSongs = insertSong(oldSongs, song, PLAY_MAX_LENGTH)
//   storage.set(PLAY_KEY, newSongs)
//   return newSongs
// }
// export function loadPlayHistory () {
//   return storage.get(PLAY_KEY)
// }

// 收藏相关函数
// export function loadFavorite () {
//   return storage.get(FAVORITE_KEY)
// }

// export function cacheFavorite (song) {
//   let oldSongs = storage.get(FAVORITE_KEY) ? storage.get(FAVORITE_KEY) : []
//   let newSongs = insertSong(oldSongs, song, 500)
//   storage.set(FAVORITE_KEY, newSongs)
//   console.log(oldSongs, newSongs)
//   return newSongs
// }

// export function delFavorite (song) {
//   let oldSongs = storage.get(FAVORITE_KEY) ? storage.get(FAVORITE_KEY) : []
//   let newSongs = deleteSong(oldSongs, song)
//   storage.set(FAVORITE_KEY, newSongs)
//   return newSongs
// }
// function deleteSong (songlist, song) {
//   let fsIndex = songlist.findIndex(item => {
//     return item.id === song.id
//   })
//   if (fsIndex > -1) {
//     songlist.splice(fsIndex, 1)
//   }
//   return songlist
// }