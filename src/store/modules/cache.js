import {
    loadSearch, loadPlayHistory, loadFavorite,
    cachePlayHistory,
    cacheFavorite, delFavorite,
    saveSearch, deleteSearch, clearSearch
} from '@/tools/localcache'

export default {
    state: {
        searchHistory: loadSearch().slice(),
        playHistory: loadPlayHistory().slice(),
        favorite: loadFavorite().slice()
    },
    getters: {
        searchHistory: state => state.searchHistory,
        playHistory: state => state.playHistory,
        favorite: state => state.favorite
    },
    mutations: {
        SET_PLAY_HISTORY (state, history) {
            state.playHistory = history
        },
        SET_SEARCH_HISTORY (state, history) {
            state.searchHistory = history
        },
        SET_FAVORITE (state, list) {
            state.favorite = list
        }
    },
    actions: {
        savePlayHistory: function ({commit}, song) {
            commit('SET_PLAY_HISTORY', cachePlayHistory(song))
        },
        saveFavorite: function ({commit}, song) {
            commit('SET_FAVORITE', cacheFavorite(song))
        },
        deleteFavorite: function ({commit}, song) {
            commit('SET_FAVORITE', delFavorite(song))
        },
        saveSearchHistory: function ({commit}, history) {
            commit('SET_SEARCH_HISTORY', saveSearch(history))
        },
        deleteSearchHistory: function ({commit}, query) {
            commit('SET_SEARCH_HISTORY', deleteSearch(query))
        },
        clearSearchHistory: function ({commit}) {
            commit('SET_SEARCH_HISTORY', clearSearch())
        }
    }
}