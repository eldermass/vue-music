<template>
    <div class="singer-list">
        <Scroll class="scroll-wrapper" :data="data" :listenScroll='true' :probeType='3'
                @scrolling='dealScroll' ref='scroll'
                :beforeScroll='true' @beforescroll='showShorcut'>
            <div>
                <div class="singer-group" v-for="singers in data" :key="singers.index" ref='listGroup'>
                    <p class="title">{{getGroupTitle(singers.index)}}</p>
                    <ul>
                        <li v-for="singer in singers.singerlist" :key="singer.id" class="item" @click="selectedSinger(singer)">
                            <div class="img">
                                <img v-lazy="singer.singer_pic" :key="singer.singer_id">
                            </div>
                            <p class="name"> 
                                {{ singer.singer_name }}
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </Scroll>
        <transition name='list-shorcut'>
            <div class='list-shorcut' v-show="shorcutShow">
                <ul>
                    <li v-for="(curt, index) of tags" :key="index" :data-index='index'
                        :class="{'item-active': anchorIndex === index}" 
                        @touchstart.stop.prevent='handleTagTouchstart(index, $event)'
                        @touchmove.stop.prevent='handleTagTouchmove(index, $event)'
                        @touchend='handleTagTouchend(index)'>
                        {{ curt.name | shortcut }}
                    </li>
                </ul>
                <span class="floattag" v-show="floatTagShow" ref="floattag">{{ floatTag | shortcut }}</span>
            </div>
        </transition>
        <div class="fix-top" v-show="fixTopShow" ref="fixtag">{{ floatTag }}</div>
    </div>
</template>
<script>
import Scroll from '_c/scroll'
export default {
    props: {
        data: {
            type: Array,
            default: () => []
        },
        tags: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            anchorIndex: 0,
            listScrollY: 0,
            groupHeights: [],
            diff: 0,
            touchPointToTop: 0,
            floatTagShow: false,
            shorcutShow: false,
            timer: null,
            fixTopShow: false
        }
    },
    methods: {
        showShorcut () {
            this.shorcutShow = true
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.shorcutShow = false
            }, 4000)
        },
        selectedSinger (singer) {
            this.$emit('singerdetail', singer)
        },
        getGroupTitle (index) {
            let curIndex = this.tags.findIndex(val => {
                return val.id === index
            })
            return this.tags[curIndex].name
        },
        initGroupHeight () {
            let list = this.$refs.listGroup
            if (!list) return
            let height = 0
            this.groupHeights = [ height ]
            for(let i = 0; i < list.length; i++){
                height += list[i].clientHeight
                this.groupHeights.push(height)
            }
        },
        dealScroll (e) {
            this.listScrollY = e.y
        },
        dealListScroll (y) {
            // 顶部tap是否显示, 解决v-show的切换在uc浏览器很卡
            if (!this.fixTopShow && y < 0) {
                this.fixTopShow = true
            }
            if (this.fixTopShow && y >= 0) {
                this.fixTopShow = false
            }
            for (let i = 0; i < this.groupHeights.length; i++) {
                let yTop = this.groupHeights[i]
                let yBottom = this.groupHeights[i + 1]
                if (-y >= yTop && -y < yBottom) {
                    // 距离当前组顶部的距离
                    this.diff = yBottom + y
                    this.anchorIndex = i
                    return
                }
            }
        },
        handleTagTouchstart (index, event) {
            this.floatTagShow = true
            this.anchorIndex = index
            this.$refs.scroll.scrollToElement(this.$refs.listGroup[this.anchorIndex])
            this.touchPointToTop = event.touches[0].pageY
        },
        handleTagTouchmove (index, event) {
            let moveY = event.touches[0].pageY - this.touchPointToTop
            let anchorIndex = index + parseInt(moveY / 14) >= 0 ? index + parseInt(moveY / 14) : 0
            this.anchorIndex = anchorIndex > 27 ? 27 : anchorIndex
            this.$refs.scroll.scrollToElement(this.$refs.listGroup[this.anchorIndex])
            
            this.showShorcut()
        },
        handleTagTouchend (index) {
            // console.log(index)
            this.floatTagShow = false
        }, 
        handleAnchorIndexChange (index) {
            if (this.floatTagShow) {
                this.$refs.floattag.style.top = this.anchorIndex * 14 + 'px'
            }
        }
    },
    filters: {
        shortcut(val) {
            return val.substr(0, 1)
        }
    },
    components: {
        Scroll
    },
    computed: {
        floatTag () {
            return this.tags.length ? this.tags[this.anchorIndex].name : '热门'
        }
    },
    watch: {
        listScrollY (y) {
            this.dealListScroll(y)
        },
        data () {
            this.$nextTick(() => {
                this.initGroupHeight()
            })
        },
        diff(newVal) {
            let fixTop = (newVal > 0 && newVal < 32) ? newVal - 31.5 : 0 
            if(this.fixTop === fixTop)
                return
            this.fixTop = fixTop
            this.$refs.fixtag.style.transform = `translate3d(0, ${this.fixTop}px, 0)`
        },
        anchorIndex (index) {
            this.handleAnchorIndexChange(index)
        }
    },
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable.less';
.singer-list {
    height: 100%;
    overflow: hidden;
    position: relative;
    .scroll-wrapper{
        height: 100%;
        .singer-group{
            .title{
                background: rgba(255, 255, 255, 0.8);
                color: #999;
                padding: 0.3rem .5rem;
            }
            .item{
                padding: 0.7rem .5rem 0.7rem 0.8rem;
                border-bottom: 1px solid #ddd;
                .img{
                    float: left;
                    width: 2rem;height: 2rem;
                    overflow: hidden; border-radius: 50%;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .name{
                    float: left;line-height: 2rem;margin-left: 1rem;
                }
                &:after{
                    display: block;
                    content: '';
                    clear: both
                }
            }
        }
    }
    .list-shorcut{
        z-index: 9;
        position: absolute;
        top: 2rem;
        right: .5rem;border-radius: 5px;
        background: lighten(@color-background, 15%);
        font-size: 11px;
        padding:.2rem 0;
        transition: opacity 1s;
        ul{
            color: #ccc;            
            .flex;
            flex-direction: column;
            li{
                width: 100%;
                height: 14px;
                line-height: 14px;
                text-align: center;
                padding: 0 0.1rem;
            }
        }
        .item-active{
            color: darken(@color-background, 30%);
        }
    }
    .floattag{
        width: 2rem;height: 2rem;
        position: absolute;
        top: 0; right: 2rem;
        transform: translate3d(0, -4.5px, 0);
        border-radius: 50%;
        z-index: 9;
        line-height: 2rem; text-align: center;
        background: lighten(@color-background, 15%);
    }
    .fix-top{
        position: absolute;
        top:0;width: 100%;
        background: rgba(255, 255, 255, 0.8);
        color: #999;
        padding: 0.3rem .5rem;
    }
}

.list-shorcut-enter, .list-shorcut-leave-to {
    opacity: 0;
}
</style>
