<template>
    <div class="disc-view">
        <div class="bg-image">
            <div class="filter-mask" :style="{'background-image': `url(${bgImage})`}"
                ref="bgfilter">
                <div class="play" ref="playbtn">
                    <div class="playall" @click.stop.prevent="randomPlayAll">
                        <span class="iconfont icon-zanting"></span>
                        <p>随机播放全部</p>
                    </div>
                </div>
            </div>
        </div>
        <Songlist :songs='songs' @blurimg='handleBlurImage' @scaleimg='handleScaleImage'
            @selectSong='handleSelectSong' :rank='rank' :more='more' @getmore='getMore'/>
        <Loading v-show="!songs.length"/>
    </div>
</template>
<script>
import Loading from '_c/loading'
import Songlist from '_c/songlist'
export default {
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
            default: () => []
        },
        rank: {
            type: Boolean,
            default: false
        },
        more: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        getMore () {
            this.$emit('getmoresong')
        },
        randomPlayAll () {
            this.$store.dispatch('randomPlay', { list: this.songs })
        },
        handleSelectSong (song, index) {
            this.$store.dispatch('selectPlay', { list: this.songs, index})
        },
        handleBlurImage (e) {
            this.$refs.bgfilter.style.filter = `blur(${-e}px)`
        },
        handleScaleImage (e) {
            this.$refs.bgfilter.style.transform = `scale(${e})`
            this.$refs.playbtn.style.transform = `scale(${1/e})`
        }
    },
    components: {
        Loading, Songlist
    }
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable.less';
.disc-view {
    height: 100%;
    .bg-image {
        height: 220px;
        position: relative;
        .filter-mask {
            height: 300px;width: 100%;
            background-size: 100% 100%;
            transform-origin: top;
            position: relative;
            // background-position-y: -1rem; 
            .play{
                z-index: 20;
                width: 100%;
                .flex;
                position: absolute;
                bottom: 100px;
                .playall{
                    background-color: rgba(0, 0, 0, 0.1);
                    .flex;border-radius: 10px;
                    padding: .2rem .3rem;
                    border:1px solid @color-background;
                    color: @color-background;
                    .icon-zanting{
                        padding: 0 .3rem;
                        transform: translateY(1px)
                    }
                }
            }
        }
    }
}
</style>
