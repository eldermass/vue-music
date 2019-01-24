<template>
    <div class="songlist" ref="songlist">
        <div class="bglayer" ref="bglayer">
            <!-- 由于scroll容器不会移动，所以要有一个背景来承托跟随移动效果 -->
        </div>
        <Scroll class="scroll-wrapper" :data='songs' :probeType='3' :listenScroll='true' 
            @scrolling='handleScroll' ref="scrollWrapper">
            <ul>
                <li v-for="(song, index) in songs" :key="song.id" class="item" @click="selectSong(song, index)">
                    <div :class="['num', getRankClass(index)]" v-if='rank'>{{index + 1}}</div>
                    <div class="txt">
                        <h4 class="name">{{song.name}}</h4>
                        <p class="desc">{{getDesc(song)}}</p>
                    </div>
                </li>
                <li class="item" v-show="more && songs.length">
                    <p class="more" v-show="!isLoading" @click.stop="getMoreSong">加载更多</p>
                    <Loading v-show="isLoading" :mini='true'/>
                </li>
            </ul>
        </Scroll>
    </div>
</template>
<script>
import Scroll from '_c/scroll'
import Loading from '_c/loading'
import { playlistMixin } from '@/mixin'
export default {
    mixins: [playlistMixin],
    props: {
        songs: {
            type: Array,
            default: () => []
        },
        rank: {
            type: Boolean,
            default: false
        },
        more: {
            type: Boolean,
            default: false
        },
        resetTop: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            scrollY: 0,
            transY: 0,
            blurpx: 0,
            scalepx: 0,
            isLoading: false
        }
    },
    mounted() {
        if (this.resetTop) {
            this.$refs.songlist.style.top = '0'
        }
    },
    methods: {
        handlePlaylist () {
            if (this.playlistLength) {
                this.$refs.songlist.style.bottom = '3rem'
            } else {
                this.$refs.songlist.style.bottom = ''
            }
            this.$refs.scrollWrapper.refresh()
        },
        getMoreSong () {
            this.isLoading = true
            this.$emit('getmore')
        },
        selectSong (song, index) {
            this.$emit('selectSong', song, index)
        },
        getDesc(song) {
            let singers = ''
            song.singer.forEach((val, index) => {
                if(index === 0){
                    singers = val.name
                }else{
                    singers += '/' + val.name
                }
            })
            return `${singers}. ${song.album}`
        },
        handleScroll (e) {
            this.scrollY = e.y
        },
        getRankClass (index) {
            if(index <= 2)
                return `icon${index}`
            else
                return 'icons'
        },
        refresh () {
            this.$refs.scrollWrapper.refresh()
        }
    },
    watch: {
        scrollY (newY) {
            let transY = newY < -220 ? -220 : newY > 60 ? 60 : newY
            if ( transY !== this.transY) {
                this.$refs.bglayer.style.transform = `translate3d(0, ${transY}px, 0)`
                this.transY = transY
                let blurpx = parseInt(transY / 20)
                let scalepx = transY / 200 + 1
                if (this.blurpx !== blurpx && blurpx <= 0) {
                    this.blurpx = blurpx
                    this.$emit('blurimg', blurpx)
                }
                if (transY > 0 && this.scalepx !== scalepx) {
                    this.scalepx = scalepx
                    this.$emit('scaleimg', scalepx)
                }
            }
        },
        songs () {
            this.isLoading = false
            this.$nextTick(() => { 
                this.$refs.scrollWrapper.refresh()
            })
        }
    },
    components: {
        Scroll, Loading
    }
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable.less';
.songlist {
    position: absolute;
    top: 220px;
    bottom: 0;
    width: 100%;
    z-index: 25;
    .bglayer {
        background-color:lighten(@color-background, 24%); 
        position: absolute;
        width: 100%;height: 150%;
    }
    .scroll-wrapper {
        height: 100%;
        .item {
            padding: .3rem 1rem;.flex;
            border-bottom: 1px solid #ddd;
            .num{
                width: 2rem;height: 2rem;text-align: right;
                padding-right: 1rem;
                font-size:18px;
                &.icon0{
                    color: gold;font-size:23px;
                    font-weight: bold;
                }
                &.icon1{
                    color:silver;font-size:22px;
                    font-weight: bold;
                }
                &.icon2{
                    color:rgb(184, 155, 51);font-size:21px;
                    font-weight: bold;
                }
                &.icons{
                    color:@color-background
                }
            }
            .txt{
                flex-grow: 1;
                .desc{
                    color: #aaa;
                    margin-top: 5px;
                    font-size: 15px;
                }
                .more{
                    text-align: center;
                    color: #666;
                    &:hover{
                        background-color: skyblue;
                    }
                }
            }
        }
    }
}
</style>
