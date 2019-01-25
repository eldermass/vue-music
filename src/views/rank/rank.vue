<template>
    <div class="rank" ref="rank">
        <Scroll class="scroll-wrapper" :data='toplist' ref="scrolls">
            <ul>
                <li class="item" v-for="top in toplist" :key='top.id' @click="goDetail(top)">
                    <div class="img">
                        <img v-lazy="top.picUrl">
                    </div>
                    <ul class="songlist">
                        <li v-for="(song, index) in top.songList" :key="index">
                            {{index+1}} {{song.songname}}-{{song.singername}}
                        </li>
                    </ul>
                </li>
            </ul>
            <Loading v-if='!toplist.length'></Loading>
        </Scroll>
        <router-view></router-view>
    </div>
</template>
<script>
import Scroll from '_c/scroll'
import Loading from '_c/loading'
import { getRanklist } from '@/api/rank'
import { mapMutations } from 'vuex'
import { playlistMixin } from '@/mixin'

export default {
    mixins: [playlistMixin],
    data() {
        return {
            toplist: []
        }
    },
    created() {
        this.getRanklistData()
    },
    methods: {
        async getRanklistData() {
            let data = await getRanklist()
            // console.log(data)
            this.toplist = data.topList
        },
        handlePlaylist(list) {
            if (this.playlistLength) {
                this.$refs.rank.style.bottom = '6rem'
            } else {
                this.$refs.rank.style.bottom = ''
            }
            this.$refs.scrolls.refresh()
        },
        goDetail(topitem) {
            // console.log(topitem)
            this.SET_TOPLIST(topitem)
            this.$router.push({ path: `/rank/${topitem.id}` })
        },
        ...mapMutations(['SET_TOPLIST'])
    },
    components: {
        Scroll, Loading
    }
}
</script>
<style lang="less" scoped>
.rank{
    position: fixed;
    top: 0;
    bottom: 3rem;width:100%;
    .scroll-wrapper{
        height: 100%;
        padding-top: .5rem;
        .item{
            margin: .5rem;background:white;
            display: flex;justify-content: center; align-items: center;
            .img{
                height: 5.5rem;width:5.5rem;
                img{
                    width: 100%;height: 100%;
                }
            }
            .songlist{
                flex-grow: 1;
                padding: .4rem;
                li{
                    margin-top:.2rem;width: 250px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    padding-left: .7rem;
                }
            }
        }
    }
}
</style>


