import { mapGetters, mapActions } from 'vuex'
// import { playMode } from 'common/js/config'
// import { disturb } from 'common/js/disturb'

export const playlistMixin = {
  computed: {
    ...mapGetters(['playList', 'playlistLength'])
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
