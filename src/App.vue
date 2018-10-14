<template>
  <div id="app">
    <Header></Header>
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
import Header from 'components/Header'
import Footer from 'components/Footer'
import {mapMutations} from 'vuex'

export default {
  name: 'App',
  components:{
    Header, Footer, Player
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

.container{
  position: fixed;
  top: @top-height;bottom: @bottom-height;
  left: 0;right: 0;
  overflow-y: scroll;
  &::-webkit-scrollbar{
    width: 0;
  }
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
