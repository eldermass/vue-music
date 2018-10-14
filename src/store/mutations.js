import * as types from './mutations-type'

const mutations = {
  [types.SET_HEAD_TITLE] (state, title) {
    state.headerTitle = title
  },
  [types.SET_HEAD_BACK] (state, obj) {
    state.headerBack = obj
  },
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_DISC] (state, disc) {
    state.disc = disc
  },
  [types.SET_TOPLIST] (state, toplist) {
    state.toplist = toplist
  },
  [types.SET_PLAY_HISTORY] (state, history) {
    state.playHistory = history
  },

  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag
  },
  [types.SET_FULLSCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST] (state, list) {
    state.playList = list
  },
  [types.SET_SEQUENCELIST] (state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENTINDEX] (state, index) {
    state.currentIndex = index
  },
  [types.SET_SEARCH_HISTORY] (state, history) {
    state.searchHistory = history
  },
  [types.SET_FAVORITE] (state, list) {
    state.favorite = list
  },
  [types.SET_VKEY] (state, vkey) {
    state.vkey = vkey
  }
}
export default mutations