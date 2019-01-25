import { playMode } from 'common/js/config'
import { disturb } from 'common/js/disturb'

export default {
    state: {
        playing: false,
        fullScreen: false,
        playList: [],
        sequenceList: [],
        mode: playMode.sequence,
        currentIndex: -1
    },
    getters: {
        playlistLength: state => state.playList.length,
        playingState: state => state.playing,
        fullScreen: state => state.fullScreen,
        playList: state => state.playList,
        sequenceList: state => state.sequenceList,
        mode: state => state.mode,
        currentIndex: state => state.currentIndex,
        currentSong: state => state.playList[state.currentIndex] || {}
    },
    mutations: {
        SET_PLAYING_STATE (state, flag) {
            state.playing = flag
        },
        SET_FULLSCREEN (state, flag) {
            state.fullScreen = flag
        },
        SET_PLAYLIST (state, list) {
            state.playList = list
        },
        SET_SEQUENCELIST (state, list) {
            state.sequenceList = list
        },
        SET_PLAY_MODE (state, mode) {
            state.mode = mode
        },
        SET_CURRENTINDEX (state, index) {
            state.currentIndex = index
        }
    },
    actions: {
        selectPlay: function ({ commit, state }, { list, index }) {
            if (state.mode === playMode.random) {
              let randomList = disturb(list)
              index = findIndex(randomList, list[index])
              commit('SET_PLAYLIST', randomList)
            } else {
              commit('SET_PLAYLIST', list)
            }
            commit('SET_SEQUENCELIST', list)
            commit('SET_FULLSCREEN', true)
            commit('SET_PLAYING_STATE', true)
            commit('SET_CURRENTINDEX', index)
        },
        randomPlay: function ({commit}, {list}) {
            commit('SET_PLAY_MODE', playMode.random)
            commit('SET_SEQUENCELIST', list)
            let randomList = disturb(list)
            commit('SET_PLAYLIST', randomList)
            commit('SET_CURRENTINDEX', 0)
            commit('SET_FULLSCREEN', true)
            commit('SET_PLAYING_STATE', true)
        },
        insertSong: function ({commit, state}, song) {
            let playList = state.playList.slice()
            let sequenceList = state.sequenceList.slice()
            let currentIndex = state.currentIndex
            let currentSong = playList[currentIndex]
            // 查看是否已经有这首歌
            let fdIndex = findIndex(playList, song)
            currentIndex++
            playList.splice(currentIndex, 0, song)
            if (fdIndex > -1) {
              if (currentIndex > fdIndex) {
                playList.splice(fdIndex, 1)
                currentIndex--
              } else {
                playList.splice(fdIndex + 1, 1)
              }
            }

            let currentSIndex = findIndex(sequenceList, currentSong)
            let fsindex = findIndex(sequenceList, song)
            sequenceList.splice(currentSIndex + 1, 0, song)
            if (fsindex > -1) {
              if (currentSIndex > fsindex) {
                sequenceList.splice(fsindex, 1)
              } else {
                sequenceList.splice(fsindex + 1, 1)
              }
            }
            commit('SET_PLAYLIST', playList)
            commit('SET_SEQUENCELIST', sequenceList)
            commit('SET_CURRENTINDEX', currentIndex)
            commit('SET_PLAYING_STATE', true)
            commit('SET_FULLSCREEN', true)
        },
        deleteSong: function ({commit, state}, song) {
            let playList = state.playList.slice()
            let sequenceList = state.sequenceList.slice()
            let currentIndex = state.currentIndex
            // 删除播放列表 和 队列里的该歌曲
            let fpIndex = findIndex(playList, song)
            playList.splice(fpIndex, 1)
            let fsIndex = findIndex(sequenceList, song)
            sequenceList.splice(fsIndex, 1)

            if (currentIndex > fpIndex || currentIndex === playList.length) {
              currentIndex--
            }
            commit('SET_PLAYLIST', playList)
            commit('SET_SEQUENCELIST', sequenceList)
            commit('SET_CURRENTINDEX', currentIndex)

            let playingState = playList.length > 0
            commit('SET_PLAYING_STATE', playingState)
        },
        deleteSongList: function ({commit}) {
            commit('SET_PLAYLIST', [])
            commit('SET_SEQUENCELIST', [])
            commit('SET_CURRENTINDEX', -1)
            commit('SET_PLAYING_STATE', false)
        }
    }
}

function findIndex (randomlist, song) {
    return randomlist.findIndex(item => {
      return item.id === song.id
    })
}