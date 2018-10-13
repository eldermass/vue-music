<template>
    <div class="rank">
        <Scroll :data='toplist' :otherRem='otherRem' ref="scrolls">
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
import Scroll from 'components/Scroll'
import Loading from 'components/Loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
export default {
    mixins:[playlistMixin],
    data() {
        return {
            toplist: [],
            otherRem: -0.5
        }
    },
    created() {
        this.getRanklist()
    },
    methods: {
        async getRanklist() {
            let res = await this.$get('/ranklist')
            // console.log(res)
            if(res.code === 0)
                this.toplist = res.data.topList
        },
        handlePlaylist(list) {
            if(list.length)
                this.otherRem = 3.5
            this.$refs.scrolls.irefresh()
        },
        goDetail(top) {
            // console.log(top)
            this.$router.push({path: `/rank/${top.id}`})
            this.setToplist(top)
        },
        ...mapMutations({
            setToplist: 'SET_TOPLIST'
        })
    },
    components: {
        Scroll, Loading
    }
}
</script>
<style lang="less" scoped>
.rank{
    position: fixed;top: 2.5rem;bottom: 3rem;width:100%;
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
</style>


