<template>
<transition name='user-slider'>
    <div class="user">
        <div class="switch-wrapper">
            <Switches :datas="['我喜欢的','最近听的']" @switch='swicthItem'></Switches>
        </div>
        <div class="play-btn" v-show="!noResult">
            <div class="btn" @click="playAll">
                <span class="iconfont icon-bofang"></span>
                <span>随机播放全部</span>
            </div>
        </div>
        <div class="list-wrapper">
            <Scroll class="favorite-list" :data='favorite' v-show="showFav">
                <ul>
                    <li v-for="(song, index) in favorite" :key="song.id" class="item" @click="selectItem(song, index)">
                    <div class="txt">
                        <h4 class="name">{{song.name}}</h4>
                        <p class="desc">{{getDesc(song)}}</p>
                    </div>
                    </li>
                </ul>
            </Scroll>
            <Scroll class="history-list" :data='playHistory' v-show="!showFav" :otherRem='otherRem' ref="hisScroll">
                <ul>
                    <li v-for="(song, index) in playHistory" :key="song.id" class="item" @click="selectItem(song, index)">
                    <div class="txt">
                        <h4 class="name">{{song.name}}</h4>
                        <p class="desc">{{getDesc(song)}}</p>
                    </div>
                    </li>
                </ul>
            </Scroll>
        </div>
        <div class="no-result" v-show="noResult">
            暂时还没有记录
        </div>
    </div>
</transition>
</template>
<script>
import Switches from 'components/Switches'
import Scroll from 'components/Scroll'
import {mapGetters, mapActions} from 'vuex'
export default {
    data() {
        return {
            showFav: true,
            first: true,
            otherRem: 0
        }
    },
    methods:{
        playAll() {
            let list = this.showFav ? this.favorite : this.playHistory
            this.randomPlay({list})
        },
        swicthItem(index) {
            this.showFav = index === 0
            if(!this.showFav && this.first) {
                this.first = false
                this.$nextTick(() => {
                    this.otherRem = 9
                    this.$refs.hisScroll.refresh()
                })
            }
        },
        selectItem(song, index) {
            this.insertSong(song)
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
        ...mapActions(['insertSong', 'randomPlay'])
    },
    computed: {
        noResult() {
            if (this.showFav) {
                return !this.favorite.length
            } else {
                return !this.playHistory.length
            }
        },
        ...mapGetters(['favorite', 'playHistory'])
    },
    components: {
        Switches, Scroll
    }
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable.less';
.user{
    position: fixed;top: 2.5rem; bottom: 3rem;width: 100%;z-index: 10000;
    .switch-wrapper{
        padding: .5rem 0;
    }
    .play-btn{
        .flex;
        .btn{
            border-radius: 5px;border: 1px solid skyblue; padding: .1rem 1rem;
        }
    }
    .list-wrapper{
        position: absolute;top:6rem;bottom: 0; width: 100%;overflow: hidden;
        .favorite-list,.history-list{
            position: absolute;top: 0;bottom: 3rem;left: 0;right: 0;
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
    .no-result{
        text-align: center;
    }
}
.user-slider-enter-active, .user-slider-leave-active{
    transition: all .5s;
}
.user-slider-enter,.user-slider-leave-to{
    transform: translateX(100%)
}
</style>

