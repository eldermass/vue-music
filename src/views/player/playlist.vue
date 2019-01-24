<template>
    <transition name='playlist-fade'>
        <div class="playlist" v-show="showFlag"  @click="hide">
            <div class="list-wrapper" @click.stop ref="listWrap">
                <div class="list-header">
                    <span :class="['iconfont', getModeIcon]" @click.stop="changeMode"></span>
                    <p class="text">{{getModeTxt}}</p>
                    <span class="iconfont icon-lajitong" @click.stop="confrimDelAll"></span>
                </div>
                <div class="list-content">
                    <Scroll class="scroll-wrapper" :data='sequenceList' ref="scroll">
                        <transition-group name='list' tag="ul">
                            <li class="item" v-for="(item, index) in sequenceList" :key="item.id"
                                @click="selectItem(item, index)" ref="songsList">
                                <span :class="['iconfont', 'icon-yinle', {'currentIcon': isCurrentSong(item)}]"></span>
                                <p class="text">{{item.name}}</p>
                                <span :class="['iconfont', getFavIcon(item)]" @click.stop="toggleFavState(item)"></span>
                                <span class="iconfont icon-cha" @click.stop="deleteOne(item)"></span>                            
                            </li>
                        </transition-group>
                    </Scroll>
                </div>
                <div class="list-operator">
                    <div class="add" @click.stop="addSong">
                        <span class="iconfont icon-yinle"></span>
                        <span>添加歌曲到队列</span>
                    </div>
                </div>
                <div class="close" @click="hide">
                    <span>关闭</span>
                </div>
            </div>
            <Confirm ref="confirm" text='是否清空播放列表' @confirm="deleteAll"></Confirm>
            <AddSong ref="addsong" @selectedsong='hide'></AddSong>
        </div>
    </transition>
</template>
<script>
import Scroll from '_c/scroll'
import Confirm from '_c/confirm'

import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { changeModeMix, favoriteMix } from 'common/js/mixin'
import AddSong from './add-song'
export default {
    mixins: [changeModeMix, favoriteMix],
    data () {
        return {
            showFlag: false
        }
    },
    methods: {
        addSong() {
            this.$refs.addsong.show()
            this.$nextTick(() => {
                this.$refs.addsong.refresh()
            })
        },
        deleteAll() {
            this.deleteSongList()
            this.hide()
        },
        confrimDelAll() {
            this.$refs.confirm.show()
        },
        deleteOne(item) {
            this.deleteSong(item)
            if(!this.playList.length)
                this.hide()
        },
        scrollToCurrentEl(currentSong) {
            let index = this.sequenceList.findIndex(song => {
                return song.id === currentSong.id
            })
            this.$refs.scroll.scrollToElement(this.$refs.songsList[index], 300)
        },
        selectItem(item, index) {
            if(this.mode === playMode.random){
                index = this.playList.findIndex(val => {
                    return val.id === item.id
                })
            }
            this.setCurrentIndex(index)
            this.setPlayState(true)
        },
        show() {
            this.showFlag = true
            this.$nextTick(() => {
                this.$refs.scroll.refresh()
            })
        },
        hide() {
            this.showFlag = false
        },
        isCurrentSong(item) {
            return this.currentSong.id === item.id
        },
        ...mapMutations({
            setCurrentIndex: 'SET_CURRENTINDEX',
            setPlayState: 'SET_PLAYING_STATE',
            SET_PLAY_MODE: 'SET_PLAY_MODE',
            SET_CURRENTINDEX: 'SET_CURRENTINDEX',
            SET_PLAYLIST: 'SET_PLAYLIST'
        }),
        ...mapActions(['deleteSong', 'deleteSongList'])
    },
    computed: {
        ...mapGetters(['sequenceList', 'currentSong', 'mode', 'playList']),
        getModeTxt() {
            switch(this.mode) {
                case playMode.sequence:
                    return '队列播放'
                case playMode.loop:
                    return '单曲循环'
                case playMode.random:
                    return '随机播放'
            }
        },
        getModeIcon() {
            switch(this.mode) {
                case playMode.sequence:
                    return 'icon-ttpodicon2'
                case playMode.loop:
                    return 'icon-danquxunhuan'
                case playMode.random:
                    return 'icon-icon-test'
            }
        }
    },
    watch: {
        currentSong(newSong, oldSong) {
            if(!this.showFlag)
                return
            if(this.newSong && this.oldSong.id && this.newSong.id !== this.oldSong.id)
                return
            this.scrollToCurrentEl(newSong)
        }
    },
    components: {
        Scroll, Confirm, AddSong
    }
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable.less';
.playlist{
    position: fixed;bottom: 0;top: 0;left:0;right: 0; z-index: 10000;
    background-color: rgba(200,200,200,.4);color: steelblue;
    .list-wrapper{
        position: absolute;top: 35%;bottom: 0;left: 0;right: 0;
        background: lighten(@color-background, 23%);overflow: hidden;
        .list-header{
            height: 3rem;
            display: flex;
            align-items: center;
            padding: .5rem 0;
            border-bottom: 1px solid #ccc;
            .text{
                flex-grow: 1;
                font-size: 18px;
            }
            .iconfont{
                font-size: 23px;
                padding: 0 .8rem;
            }
        }
        .list-content{
            position: absolute;
            top: 3rem;
            bottom: 2.5rem;
            padding-bottom: 3rem;
            width: 100%;
            overflow: hidden;
            .scroll-wrapper {
                height: 100%;
                .item{
                    height: 2.8rem;
                    display: flex;
                    align-items: center;
                    padding: .5rem 0.3rem;
                    border-bottom:1px solid #dfdfdf;
                    opacity: 1;
                    overflow: hidden;
                    .text{
                        flex-grow: 1;
                        font-size: 17px;
                        display: inline-block;
                        .wrap;
                    }
                    .iconfont{
                        font-size: 20px;
                        padding: 0 .5rem;
                    }
                    .icon-shoucang, .icon-shoucang1{
                        padding: 0;
                    }
                    .xihuan{
                        color: pink
                    }
                    .icon-yinle{
                        visibility: hidden;
                    }
                    .currentIcon{
                        visibility: visible;
                    }
                }
            }
        }
        .list-operator{
            position: absolute;
            bottom: 2.5rem;
            width: 100%;.flex;
            height: 3rem;
            background-color: lighten(@color-background, 23%);
            .add{
                display: inline-block; padding: .2rem .5rem;
                border: 1px solid @color-background;
                border-radius: 10px;
            }
        }
        .close{
            position: absolute;bottom: 0;width: 100%;
            height: 2.5rem;.flex;
            background-color: lighten(@color-background, 15%);
            font-size: 1.1em;color: steelblue;
        }
    }
}
.playlist-fade-enter-active, .playlist-fade-leave-active{
    transition: all .3s;
    .list-wrapper{
        transition: all .3s
    }
}
.playlist-fade-enter, .playlist-fade-leave-to{
    opacity: 0;
    .list-wrapper{
        transform: translateY(100%);
    }
}
.list-enter-active, .list-leave-active{
    transition: all .2s linear;
}
.list-enter, .list-leave-to{
    opacity: 0!important;
    height: 0!important;
    padding: 0 0.3rem!important;
}
</style>

