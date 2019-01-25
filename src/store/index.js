import Vue from 'vue'
import Vuex from 'vuex'

import player from './modules/player'
import transit from './modules/transit'
import cache from './modules/cache'
// import createlogger from 'vuex/dist/logger'

const debug = process.env.NODE_ENV !== 'production'
Vue.use(Vuex)

export default new Vuex.Store({
  strict: debug,
  modules: {
    player,
    transit,
    cache
  }
  // plugins: debug ? [createlogger()] : []
})
