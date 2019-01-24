import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
// import player from './modules/player'

import createlogger from 'vuex/dist/logger'

const debug = process.env.NODE_ENV !== 'production'
Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  strict: debug,
  modules: {
    // player
  }
  // plugins: debug ? [createlogger()] : []
})
