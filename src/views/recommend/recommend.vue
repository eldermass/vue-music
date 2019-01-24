<template>
    <div class="recommend">
        <div v-if="sliderDatas.length">
            <Slider>
                <div v-for="item of sliderDatas" :key='item.id'>
                    <a :href="item.linkUrl">
                        <img :src="item.picUrl">
                    </a>
                </div>
            </Slider>
        </div>
        <div class="stake" v-if="!sliderDatas.length">
            <!-- 撑开图片区域 -->
        </div>
        <div class="recommend-list" ref="recList">
            <h3 class="list-title">热门歌单推荐</h3>
            <div class="list-scroll-wrapper" ref="listScrollWrapper">
                <Scroll class="scroll-wrapper" :data='discList' ref="scroll">
                    <ul>
                        <li class="item" v-for="item in discList" :key="item.dissid" @click="checkablum(item)">
                            <div class="icon">
                                <img v-lazy="item.imgurl" width="60" height="60">
                            </div>
                            <div class="text">
                                <h4 class="name" v-html="item.creator.name"></h4>
                                <p class="dest" v-html="item.dissname"></p>
                            </div>
                        </li>
                    </ul>
                    <div class="loading-container" v-show="!discList.length">
                        <Loading></Loading>
                    </div>
                </Scroll>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
import Scroll from '_c/scroll'
import Loading from '_c/loading'
import Slider from '_c/slider'
import { getSlider, getRecommend } from '@/api/recommend'
import { playlistMixin } from '@/mixin'
import { mapMutations } from 'vuex'

export default {
    mixins: [ playlistMixin ],
    data(){
        return {
            sliderDatas: [],
            discList: []
        }
    },
    methods:{
        handlePlaylist () {
            if (this.playlistLength) {
                this.$refs.listScrollWrapper.style.paddingBottom = '6rem'
            } else {
                this.$refs.listScrollWrapper.style.paddingBottom = ''
            }
            this.$refs.scroll.refresh()
        },
        async getSliderDatas(){
            // 抓取轮播数据
            // 数据异步抓取， 会影响后来的渲染， v-if 判断数据拥有后再渲染
            let data = await getSlider()
            this.sliderDatas = data.slider
        },
        async getRecommendData(){
            let data = await getRecommend()
            this.discList = data.data.list
            this.$nextTick(() => {
                this.changePosition()
            })
        },
        checkablum (item) {
            this.SET_DISC(item)
            
            this.$router.push({
                path: `/recommend/${item.dissid}`
            })
        },
        changePosition () {
            // 图片载入后撑开区域
            this.$refs.recList.style.top = this.$refs.recList.offsetTop + 'px'
            this.$refs.recList.style.position = 'absolute'
        },
        ...mapMutations(['SET_DISC'])
    },
    mounted () {
        this.getSliderDatas()
        this.getRecommendData()
    },
    components:{
        Slider, Scroll, Loading
    }
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable.less';
.recommend{
    height: 100%;
    .recommend-list{
        // position: absolute;
        // top: 154px;
        bottom: 0; 
        width: 100%;
        .list-title{
            text-align: center;
            margin: 10px 0;
        }
        .list-scroll-wrapper{
            height: 100%;
            padding-bottom: 3rem;
            overflow: hidden;
            .scroll-wrapper{
                height: 100%;
                .item{
                    .flex;
                    margin-top: 5px;
                    background-color: white; 
                    padding: .5rem 1rem .5rem 1rem;
                    &:nth-of-type(1){
                        margin-top: 0;
                    }
                    .icon{
                        padding-right: 1rem; 
                    }
                    .text{
                        flex:1;
                        .flex; overflow: hidden;
                        flex-direction: column;
                        align-items: flex-start;
                        .dest{
                            .wrap;
                            width: 100%;
                            margin-top: .5rem;
                        }
                    }
                }
                .loading-container{
                    margin-top: 50%;
                    transform: translateY(-50%)
                }
            }
        }
    }
    .stake{
        height: 0;
        width: 100%;
        padding-top: 40%;
    }
}
</style>


