<template>
    <div class="songlist" ref="songlistWrapper">
        <div class="bglayer" ref="bglayer"></div>
        <Scroll :singer='songs' :probeType='3' :listenScroll='true' @scrolling='dealScroll' 
                :otherHeight='otherHeight' :otherRem='otherRem' ref="songlist">
        <ul>
            <li v-for="(song, index) in songs" :key="song.id" class="item" @click="selectItem(song, index)">
                <div :class="['num', getRankClass(index)]" v-if='rank'>{{index + 1}}</div>
                <div class="txt">
                    <h4 class="name">{{song.name}}</h4>
                    <p class="desc">{{getDesc(song)}}</p>
                </div>
            </li>
            <li class="item" style="text-align:center;padding:.7rem" @click="getMore" v-show="songs.length">
                <p class="more" v-show="!isLoading && music">加载更多</p>
                <img :src="loadingImg" height="20" width="20" v-show="isLoading">
            </li>
        </ul>
        </Scroll>
    </div>    
</template>
<script>
import Scroll from 'components/Scroll'

export default {
    data() {
        return {
            scrollY: 0,
            transY: 0,
            blurpx: 0,
            loadingImg: require('../common/image/loading.gif'),
            isLoading: false
        }
    },
    props: {
        songs: {
            type: Array,
            default: () => []
        },
        otherRem: {
            type: Number,
            default: 0
        },
        otherHeight: {
            type: Number,
            default: 220
        },
        rank: {
            type: Boolean,
            default: false
        },
        resetTop: {
            type: Boolean,
            default: false
        },
        music: {
            type: Boolean,
            default: true
        }
    },
    mounted() {
        if(this.resetTop){
            this.$refs.songlistWrapper.style.top = '3rem'
        }    
    },
    methods: {
        getRankClass(index) {
            if(index <= 2)
                return `icon${index}`
            else
                return 'icons'
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
        getMore() {
            this.isLoading = true
            this.$emit('getmoresongs')
            this.$refs.songlist.refresh()
        },
        dealScroll(e) {
            this.scrollY = e.y
        },
        selectItem(song, index){
            this.$emit('select', song, index)
        },
        refresh() {
            this.$refs.songlist.refresh()
        }
    },
    components: {
        Scroll
    },
    watch: {
        scrollY(y) {
            let transY = y < -230 ? -230 : y > 60 ? 60 : y
            if(this.transY !== transY){
                this.$refs.bglayer.style.transform = `translateY(${y}px)`
                this.transY = transY
                let blurpx = parseInt(transY / 20)
                if(this.blurpx !== blurpx){
                    this.blurpx = blurpx
                    this.$emit('blurpx', blurpx)
                }
                if(transY > 0){
                    this.$emit('blurpx', transY)
                }
            }
        },
        songs(){
            this.isLoading = false
        }
    }
}
</script>
<style lang="less" scoped>
@import '../common/less/variable.less';
.songlist{
    position: absolute; top: 220px; bottom: 0;width: 100%;
    // overflow: hidden;
    .bglayer{
        background-color:lighten(@color-background, 24%); 
        position: absolute;
        width: 100%;height: 500px;
    }
    .item{
        padding: .3rem 1rem;.flex;
        border-bottom: 1px solid #f1f1f1;
        .num{
            width: 2rem;height: 2rem;text-align: right;
            padding-right: 1rem;font-size:18px;
            &.icon0{
                color: gold;font-size:21px;
                font-weight: bold;
            }
            &.icon1{
                color:silver;font-size:20px;
                font-weight: bold;
            }
            &.icon2{
                color:rgb(184, 155, 51);font-size:19px;
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
</style>


