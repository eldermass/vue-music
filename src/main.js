import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Api from './api'
import Lazyload from 'vue-lazyload'

import 'common/less/index.less'
// 移动端 取消点击的300ms延迟
import fastclick from 'fastclick'
fastclick.attach(document.body)

Vue.config.productionTip = false

Vue.use(Lazyload, {
  loading: require('common/image/bagua.png')
})

Vue.prototype.$post = Api.postData
Vue.prototype.$get = Api.getData
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
