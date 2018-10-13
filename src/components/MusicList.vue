<template>
    <div class="musiclist" ref="musiclist">
        <div class="bg-image">
            <div class="filter" :style="bgimg" ref="bgimg">
                <div class="play" v-show="songs.length" ref="palyall">
                    <div class="playin"  @click.stop.prevent="randomPlay">
                        <span class="iconfont icon-bofang"></span>
                        <p>随机播放全部</p>
                    </div>
                </div>
            </div>
        </div>
        <Songlist :songs='songs' :otherRem='otherRem' @getmoresongs='getMore'
                 @blurpx='imgblur' @select="selectItem" :rank='rank'></Songlist>
    </div>
</template>
<script>
import {mapMutations,} from 'vuex'
import Songlist from './Songlist'
import {playlistMixin} from 'common/js/mixin'
export default {
    mixins: [ playlistMixin ],
    data() {
        return {
            otherRem: 0
        }
    },
    props: {
        bgImage: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        songs: {
            type: Array,
            default:() => []
        },
        backto:{
            type: Object,
            default: () => {
                return {
                    path: '/recommend',
                    header: 'iMusic'
                }
            }
        },
        rank: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        bgimg(){
            return `background-image:url(${this.bgImage})`
        }
    },
    mounted () {
        // 第一时间不能获取prop数据的
        setTimeout(()=>{
            // console.log(this.bgImage,this.title,this.songs)
            this.setHeaderBack({path: this.backto.path, header: this.backto.header})
            this.changeHeader(this.title)
        }, 20)
    },
    methods: {
        ...mapMutations({
            setHeaderBack: 'SET_HEAD_BACK',
            changeHeader: 'SET_HEAD_TITLE'
        }),
        getMore(){
            this.$emit('getmoresong')
        },
        imgblur(e){
            if(e <= 0)
                this.$refs.bgimg.style.filter = `blur(${-e}px)`
            else{
                let scale = e/200 + 1
                this.$refs.bgimg.style.transform = `scale(${scale}, ${scale})`
                this.$refs.palyall.style.transform = `scale(${1/scale}, ${1/scale})`
            }
        },
        randomPlay() {
            this.$store.dispatch('randomPlay', {list: this.songs})
        },
        selectItem(song, index) {
            this.$store.dispatch('selectPlay', {list: this.songs, index})
        },
        handlePlaylist() {
            this.otherRem = this.$store.getters.playList.length ? 3 : 0
            this.$refs.musiclist.style.bottom = `${this.otherRem}rem`
        }
    },
    components: {
        Songlist
    }
}
</script>
<style lang="less" scoped>
@import '../common/less/variable.less';
.musiclist{
    position: absolute;top:0; bottom: 0; width: 100%;overflow: hidden;
    .bg-image{
        height: 220px;
        // overflow: hidden;
        .filter{
            background-position-y: -1rem; 
            height: 300px;width: 100%;
            background-size:100% 100%;
            transform-origin:top; 
            position: relative;
            .play{
                z-index: 20;
                width: 100%;.flex;
                position: absolute;
                bottom: 100px;
                .playin{
                    .icon-bofang{
                        margin: 0 .3rem;
                        transform: translateY(1px)
                    }
                    .flex;border-radius: 10px;
                    padding: .2rem .3rem;
                    border:1px solid @color-background;
                    color: @color-background;
                }
            }
        }
    }
}
</style>


