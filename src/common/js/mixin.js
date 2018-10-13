import { mapGetters, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { disturb } from 'common/js/disturb'

export const playlistMixin = {
  computed: {
    ...mapGetters(['playList'])
  },
  mounted () {
    this.handlePlaylist(this.playList)
  },
  activated () {
    // keep-alive 活跃时的钩子
    this.handlePlaylist(this.playList)
  },
  watch: {
    playList (newList) {
      this.handlePlaylist(newList)
    }
  },
  methods: {
    handlePlaylist () {
      // 如果没有被 用户方法覆盖， 就会抛出异常
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const changeModeMix = {
  methods: {
    changeMode () {
      let mode = (this.mode + 1) % 3
      this.SET_PLAY_MODE(mode)
      let list = null
      if (mode === playMode.random) {
        list = disturb(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      // 保证当前歌曲不变
      this.resetCurrentIndex(list)
      this.SET_PLAYLIST(list)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.SET_CURRENTINDEX(index)
    }
  }
}
export const searchMix = {
  methods: {
    ...mapActions(['saveSearchHistory', 'deleteSearchHistory']),
    queryChange (query) {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        if (query) {
          this.query = query
          this.queryShow = true
        } else {
          this.queryShow = false
        }
      }, 200)
    },
    listScroll () {
      this.$refs.searchBox.blur()
    },
    deleteHistory (item) {
      this.deleteSearchHistory(item)
    },
    addQuery (val) {
      this.$refs.searchBox.setQuery(val)
    }
  }
}

export const favoriteMix = {
  methods: {
    getFavIcon (song) {
      if (this.isFavoriteSong(song)) {
        return 'icon-shoucang xihuan'
      } else {
        return 'icon-shoucang1'
      }
    },
    toggleFavState (song) {
      if (this.isFavoriteSong(song)) {
        this.deleteFavorite(song)
      } else {
        this.saveFavorite(song)
      }
    },
    isFavoriteSong (song) {
      const index = this.favorite.findIndex(item => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapActions(['saveFavorite', 'deleteFavorite'])
  },
  computed: {
    ...mapGetters(['favorite'])
  }
}