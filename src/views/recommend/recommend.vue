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
        <div class="recommend-list" ref="recList">
            <h3 class="list-title">热门歌单推荐</h3>
            <Scroll :data='discList' :otherHeight='154' :otherRem='otherRem' ref="scroll">
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
        <router-view></router-view>
    </div>
</template>
<script>
import Slider from 'components/Slider'
import Scroll from 'components/Scroll'
import Loading from 'components/Loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
import {getSlider} from '@/api/recommend'
export default {
    mixins: [playlistMixin],
    data(){
        return {
            sliderDatas:[],
            discList: [],
            otherRem: 0
        }
    },
    methods:{
        handlePlaylist () {
            this.otherRem = this.playList.length ? 3 : 0
            this.$refs.recList.style.bottom = `${this.otherRem}rem`
            this.$refs.scroll.irefresh()
        },
        async getSliderDatas(){
            // 抓取轮播数据
            // 数据异步抓取， 会影响后来的渲染， v-if 判断数据拥有后再渲染
            let res = await this.$get('/pageslider')
            this.sliderDatas = res.data.slider
        },
        async getRecommend(){
            let res = await this.$get('/recommend')
            this.discList = res.data.data.list
        },
        checkablum (item) {
            this.$router.push({
                path: `/recommend/${item.dissid}`
            })
            this.setDisc(item)
        },
        ...mapMutations({
            setDisc: 'SET_DISC'
        })
    },
    created () {
        this.getSliderDatas()
        this.getRecommend()
    },
    components:{
        Slider, Scroll, Loading
    }
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable.less';
.recommend{
    position: fixed;top: 2.5rem; bottom: 3rem;width: 100%;
    .recommend-list{
        position: absolute;bottom:0; top: 154px;width: 100%;
        .list-title{
            text-align: center;
            margin: 10px 0;
        }
        .item{
            .flex;
            margin-top: 5px;
            background-color: white; 
            padding: .5rem 1rem .5rem 1rem;
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
</style>


