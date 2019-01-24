<template>
    <div class="singer">
        <div class="tags">
            <Taglist :data="tags.area" @onselecttag="selectTag('area', $event)"></Taglist>
            <Taglist :data="tags.genre" @onselecttag="selectTag('genre', $event)"></Taglist>
            <Taglist :data="tags.sex" @onselecttag="selectTag('sex', $event)"></Taglist>
        </div>
        <div class="list-wrapper" ref="singerlistWrapper">
            <Loading v-show="!singers.length" />
            <SingerList :data="singers" :tags="tags.index" @singerdetail='singerDetail'></SingerList>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
import Loading from '_c/loading'
import Taglist from '_c/taglist'
import SingerList from '_c/singerlist'
import { getSingerList } from '@/api/singer'
import { mapMutations } from 'vuex'
import { playlistMixin } from '@/mixin'

export default {
    mixins: [playlistMixin],
    data(){
        return {
            singers: [],
            tags: [],
            cur_tag: {
                area: -100,
                genre: -100,
                sex: -100,
                index: -100
            }
        }
    },
    created() {
        this.getSingerListData()
    },
    methods:{
        async getSingerListData () {
            let hotSinger = await getSingerList({ page: 1 })
            this.tags = hotSinger.tags
            this.singers = [hotSinger]
            // 载入缓存的singer数据
            if(!window.localStorage.singers){
                let data = await getSingerList({ page: 1, all: true })
                let singerString =  JSON.stringify(data)
                data.unshift(hotSinger)
                this.singers = data
                window.localStorage.singers = singerString
            }else{
                let singers = JSON.parse(window.localStorage.singers)
                singers.unshift(hotSinger)
                this.singers = singers
            }
        },
        async selectTag (type, e) {
            this.cur_tag[type] = e.tagId
            let selectSinger = await getSingerList(Object.assign(this.cur_tag, { page:1, index:-100 }))
            this.singers.shift()
            this.singers.unshift(selectSinger)
        },
        singerDetail (singer) {
            this.SET_SINGER(singer)
            this.$router.push({
                path: `/singer/${singer.singer_mid}`
            })
        },
        handlePlaylist () {
            if (this.playlistLength) {
                this.$refs.singerlistWrapper.style.bottom = '3rem'
            } else {
                this.$refs.singerlistWrapper.style.bottom = ''
            }
        },
        ...mapMutations(['SET_SINGER'])
    },
    components: {
        Loading, Taglist, SingerList
    },
}
</script>
<style lang="less" scoped>
.singer{
    position: fixed;  width:100%;
    top: 0;bottom: 3rem;
    .tags{
        margin: 0.3rem;
        font-size: 16px;
    }
    .list-wrapper{
        position: absolute;
        top: 94px;bottom: 0;
        width: 100%;
    }
}
</style>


