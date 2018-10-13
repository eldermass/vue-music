<template>
    <div class="listview" @touchmove='showShorcut' @touchend='hideShorcut'>
        <Scroll :data="data" :listenScroll='true' :probeType='3' :otherHeight='81' :otherRem='otherRem'
                @scrolling='dealScroll' ref='scroll'>
            <div>
                <div class="singer-group" v-for="singers in data" :key="singers.index" ref='listGroup'>
                    <p class="title">{{getListTitle(singers.index)}}</p>
                    <ul>
                        <li v-for="singer in singers.singerlist" :key="singer.id" class="item" @click="singerDetail(singer)">
                            <div class="img">
                                <img v-lazy="singer.singer_pic" :key="singer.singer_id">
                            </div>
                            <p class="name"> 
                                {{singer.singer_name}}
                            </p>
                            <span class="arrow"></span>
                        </li>
                    </ul>
                </div>
            </div>
            <div :class="['list-shorcut', {listactive: listactive}]">
                <ul @touchstart='touchitem'>
                    <li v-for="(curt, index) of tags" :key="index" :data-index='index'
                    @touchmove.stop.prevent='selectitem(index, $event)'
                    @touchend='selecteditem' :class="{'item-active':anchorIndex === index}">
                        {{curt.name | shortcut}}
                    </li>
                </ul>
            </div>
            <span class="floattag" v-show="tagshow" ref="floattag">{{tagin | anChar}}</span>
        </Scroll>
        <div class="fixtag" v-show="data.length && listScrollY < 0" ref="fixtag">{{tagin}}</div>
    </div>    
</template>
<script>
import Scroll from 'components/Scroll'
import {playlistMixin} from 'common/js/mixin'
export default {
    mixins: [playlistMixin],
    data(){
        return {
            listactive: false,
            timer: null,
            disy: 0,
            anchorIndex: 0,
            tagin: '热门',
            tagshow: false,
            listScrollY: 0,
            listHeight: [],
            diff: -1,
            fixTop: 0,
            otherRem: 0.6
        }
    },
    props: {
        data: {
            type: Array,
            default: [],
        },
        tags: {}
    },
    methods:{
        handlePlaylist () {
            this.otherRem = this.playList.length ? 3.6 : 0
        },
        singerDetail(singer) {
            this.$emit('singerdetail', singer)
        },
        dealScroll(e){
            this.listScrollY = e.y
        },
        getListTitle (index) {
            let curIndex = this.tags.findIndex(val => {
                return val.id === index
            })
            return this.tags[curIndex].name
        },
        showShorcut(){
            // 大区域滚动时
            this.listactive = true;
            this.listHeight.forEach((val, index) => {
                if(-this.listScrollY > val && -this.listScrollY < this.listHeight[index + 1]){
                    // 距离顶部的距离
                    this.diff = this.listHeight[index + 1] + this.listScrollY
                    this.anchorIndex = index
                    this.tagin = this.tags[this.anchorIndex].name
                }
            })
        },
        hideShorcut(){
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.listactive = false;
            }, 7000)
        },
        touchitem(e){
            // 事件委派 this.$refs.el 其他自定义组件返回的是vue实例，本组件是一般dom元素
            this.anchorIndex = parseInt(e.target.getAttribute('data-index'))
            this.$refs.scroll.scrollToElement(this.$refs.listGroup[this.anchorIndex])
            this.disy = e.touches[0].pageY
        },
        selectitem(index, e){
            let y = e.touches[0].pageY - this.disy
            let anchorIndex = index + parseInt(y/16) >= 0 ? index + parseInt(y/16) : 0
            this.anchorIndex = anchorIndex > 27 ? 27 : anchorIndex

            this.$refs.floattag.style.top = 120 + this.anchorIndex*16 + 'px'
            this.tagshow = true
            this.tagin = this.tags[this.anchorIndex].name
            this.hideShorcut()
        },
        selecteditem(){
            this.tagshow = false
            this.tagin = this.tags[this.anchorIndex].name
            this.$refs.scroll.scrollToElement(this.$refs.listGroup[this.anchorIndex])
        },
        calculateH () {
            this.listHeight = []
            let list = this.$refs.listGroup
            let height = 0
            this.listHeight.push(height)
            for(let i = 0; i < list.length; i++){
                height += list[i].clientHeight
                this.listHeight.push(height)
            }
        }
    },
    filters:{
        shortcut(val) {
            return val.substr(0, 1)
        },
        anChar(val) {
            return val.substr(0, 1)
        }
    },
    components: {
        Scroll
    },
    watch: {
        data() {
            setTimeout(() => {
                this.calculateH()
            }, 20)
        },
        diff(newVal) {
            let fixTop = (newVal > 0 && newVal < 32) ? newVal - 31 : 0 
            if(this.fixTop === fixTop)
                return
            this.fixTop = fixTop
            this.$refs.fixtag.style.transform = `translateY(${this.fixTop}px)`
        }
    }
}
</script>
<style lang="less" scoped>
@import '../common/less/variable.less';
.listview{
    overflow: hidden;
    position: relative;
    .singer-group{
        .title{
            background: #f1f1f1;
            padding: 0.3rem .5rem;
        }
        .item{
            margin-left: .3rem;
            padding: 0.7rem .5rem;
            border-bottom: 1px solid #ddd;
            .img{
                float: left;
                width: 2rem;height: 2rem;
                overflow: hidden; border-radius: 50%;
                img{
                    width: 100%;border: 1px solid #f1f1f1
                }
            }
            .name{
                float: left;line-height: 2rem;margin-left: 1rem;
            }
            .arrow{
                float: right;
            }
            &:after{
                display: block;
                content: '';
                clear: both
            }
        }
    }
    .list-shorcut{
        z-index: 9;
        position: fixed;top: 8rem;right: .2rem;border-radius: 5px;
        background: lighten(@color-background, 15%);
        font-size: @small-font;padding:.2rem .1rem;
        transition: opacity 2s;
        opacity: 0;
        ul{
            color: #ccc;            
            .flex;
            flex-direction: column;
            li{
                width: 100%;text-align: center;
            }
        }
        .item-active{
            color: darken(@color-background, 30%);
        }
    }
    .listactive{
        opacity: 1;
    }
    .floattag{
        z-index: 9; .flex;
        position: fixed;top: 9rem;right: 2rem;border-radius: 50%;
        width: 2rem;height: 2rem;
        background: lighten(@color-background, 15%);
    }
    .fixtag{
        position: absolute;
        top:0;width: 100%;
        background: #f1f1f1;
        padding: 0.3rem .5rem;
    }
}
</style>


