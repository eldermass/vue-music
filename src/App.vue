<template>
  <div id="app">
    <div class="container">
      <transition name="router-toggle">
        <keep-alive>
          <router-view/>
        </keep-alive>
      </transition>
    </div>
    <Footer></Footer>
    <Player></Player>
  </div>
</template>

<script>
import Player from '@/views/player/player'
import Footer from '_c/footer'
import { mapMutations } from 'vuex'

export default {
  name: 'App',
  components:{
    Footer, Player
  },
  mounted() {
    this.$get('/vkey').then(res => {
      let res1 = res.data.replace(/\(({.+})\)/, ($, $1) => {
        let vkey = JSON.parse($1).req.data.vkey
        this.SET_VKEY(vkey)
      })
    })
  },
  methods: {
    ...mapMutations(['SET_VKEY'])
  }
}
</script>

<style lang='less' scoped>
@import '../src/common/less/variable';
*{
  font-family: Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", STXihei, "Microsoft YaHei", SimHei, "WenQuanYi Micro Hei";
}
.container{
  position: fixed;
  // top: @top-height;
  top: 0;
  bottom: @bottom-height;
  left: 0;right: 0;
  // overflow: hidden;
}
.router-toggle-enter-active,.router-toggle-leave-active{
  transition: all .3s
}
.router-toggle-enter{
  transform: scale(.8);
  opacity: 0;
}
.router-toggle-leave-to{
  transform: scale(1.2);
  opacity: 0;
}
</style>
