// import * as types from './mutations-type'
// import {playMode} from 'common/js/config'
// import {disturb} from 'common/js/disturb'
// import {saveSearch, deleteSearch, clearSearch, cachePlayHistory, cacheFavorite, delFavorite} from 'common/js/cache'

// function findIndex (randomlist, song) {
//   return randomlist.findIndex(item => {
//     return item.id === song.id
//   })
// }
// 一般封装异步操作,或者多个mutations
// export const selectPlay = function ({commit, state}, {list, index}) {
//   if (state.mode === playMode.random) {
//     let randomList = disturb(list)
//     index = findIndex(randomList, list[index])
//     commit(types.SET_PLAYLIST, randomList)
//   } else {
//     commit(types.SET_PLAYLIST, list)
//   }
//   commit(types.SET_SEQUENCELIST, list)
//   commit(types.SET_FULLSCREEN, true)
//   commit(types.SET_PLAYING_STATE, true)
//   commit(types.SET_CURRENTINDEX, index)
// }

// export const randomPlay = function ({commit}, {list}) {
//   commit(types.SET_PLAY_MODE, playMode.random)
//   commit(types.SET_SEQUENCELIST, list)
//   let randomList = disturb(list)
//   commit(types.SET_PLAYLIST, randomList)
//   commit(types.SET_CURRENTINDEX, 0)
//   commit(types.SET_FULLSCREEN, true)
//   commit(types.SET_PLAYING_STATE, true)
// }

// export const insertSong = function ({commit, state}, song) {
//   let playList = state.playList.slice()
//   let sequenceList = state.sequenceList.slice()
//   let currentIndex = state.currentIndex
//   let currentSong = playList[currentIndex]
//   // 查看是否已经有这首歌
//   let fdIndex = findIndex(playList, song)
//   currentIndex++
//   playList.splice(currentIndex, 0, song)
//   if (fdIndex > -1) {
//     if (currentIndex > fdIndex) {
//       playList.splice(fdIndex, 1)
//       currentIndex--
//     } else {
//       playList.splice(fdIndex + 1, 1)
//     }
//   }

//   let currentSIndex = findIndex(sequenceList, currentSong)
//   let fsindex = findIndex(sequenceList, song)
//   sequenceList.splice(currentSIndex + 1, 0, song)
//   if (fsindex > -1) {
//     if (currentSIndex > fsindex) {
//       sequenceList.splice(fsindex, 1)
//     } else {
//       sequenceList.splice(fsindex + 1, 1)
//     }
//   }
//   commit(types.SET_PLAYLIST, playList)
//   commit(types.SET_SEQUENCELIST, sequenceList)
//   commit(types.SET_CURRENTINDEX, currentIndex)
//   commit(types.SET_PLAYING_STATE, true)
//   commit(types.SET_FULLSCREEN, true)
// }
// export const deleteSong = function ({commit, state}, song) {
//   let playList = state.playList.slice()
//   let sequenceList = state.sequenceList.slice()
//   let currentIndex = state.currentIndex
//   // 删除播放列表 和 队列里的该歌曲
//   let fpIndex = findIndex(playList, song)
//   playList.splice(fpIndex, 1)
//   let fsIndex = findIndex(sequenceList, song)
//   sequenceList.splice(fsIndex, 1)

//   if (currentIndex > fpIndex || currentIndex === playList.length) {
//     currentIndex--
//   }
//   commit(types.SET_PLAYLIST, playList)
//   commit(types.SET_SEQUENCELIST, sequenceList)
//   commit(types.SET_CURRENTINDEX, currentIndex)

//   let playingState = playList.length > 0
//   commit(types.SET_PLAYING_STATE, playingState)
// }
// export const deleteSongList = function ({commit}) {
//   commit(types.SET_PLAYLIST, [])
//   commit(types.SET_SEQUENCELIST, [])
//   commit(types.SET_CURRENTINDEX, -1)
//   commit(types.SET_PLAYING_STATE, false)
// }

// 处理收索缓存相关
// export const saveSearchHistory = function ({commit}, history) {
//   commit(types.SET_SEARCH_HISTORY, saveSearch(history).slice())
// }
// export const deleteSearchHistory = function ({commit}, query) {
//   commit(types.SET_SEARCH_HISTORY, deleteSearch(query).slice())
// }
// export const clearSearchHistory = function ({commit}) {
//   commit(types.SET_SEARCH_HISTORY, clearSearch())
// }

// 存放播放历史
// export const savePlayHistory = function ({commit}, song) {
//   commit(types.SET_PLAY_HISTORY, cachePlayHistory(song).slice())
// }
// 收藏相关
// export const saveFavorite = function ({commit}, song) {
//   commit(types.SET_FAVORITE, cacheFavorite(song).slice())
// }
// export const deleteFavorite = function ({commit}, song) {
//   commit(types.SET_FAVORITE, delFavorite(song).slice())
// }
