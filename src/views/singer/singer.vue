<template>
    <div class="singer">
        <div class="tags">
            <Taglist :data="tags.area" @onselecttag="selectTag('area', $event)"></Taglist>
            <Taglist :data="tags.genre" @onselecttag="selectTag('genre', $event)"></Taglist>
            <Taglist :data="tags.sex" @onselecttag="selectTag('sex', $event)"></Taglist>
        </div>

        <Listview :data="singers" :tags="tags.index" v-show="isFirstPage" @singerdetail='singerDetail'></Listview>
        <Listview :data="selectSinger" :tags="tags.index" v-if="!isFirstPage" @singerdetail='singerDetail'></Listview>
        <router-view></router-view>
    </div>
</template>
<script>
import Loading from 'components/Loading'
import Listview from 'components/Listview'
import Taglist from 'components/Taglist'
import {mapMutations} from 'vuex'
export default {
    data(){
        return {
            singers: [],
            tags: [],
            cur_tag: {
                area: -100,
                genre: -100,
                sex: -100,
                index: -100
            },
            selectSinger: [],
            isFirstPage: true,
            allchar: []
        }
    },
    created() {
        this.getSingerList()
    },
    methods:{
        async getSingerList () {
            let hot = await this.$get('/singerlist', {page: 1})
            this.tags = hot.data.tags
            this.singers = [hot.data]

            if(!window.localStorage.singers){
                let res = await this.$get('/singerlist', {page: 1, all: true})
                let singerString =  JSON.stringify(res.data)
                this.allchar = JSON.parse(singerString)
                res.data.unshift(hot.data)
                this.singers = res.data
                window.localStorage.singers = singerString
            }else{
                let singers = JSON.parse(window.localStorage.singers)
                singers.unshift(hot.data)
                this.singers = singers
            }
        },
        async selectTag (type, e) {
            this.cur_tag[type] = e.tagId
            for(let val of Object.values(this.cur_tag)){
                val != -100 && (this.isFirstPage = false)
            }
            if(!this.isFirstPage){
                let hot = await this.$get('/singerlist', Object.assign({}, this.cur_tag, {page:1,index:-100}))
                let singers = ''
                if(window.localStorage.singers){
                    singers = JSON.parse(window.localStorage.singers)
                }else{
                    singers = JSON.parse(JSON.stringify(this.allchar))
                }
                singers.unshift(hot.data)
                this.selectSinger = singers
            }
        },
        singerDetail (singer) {
            this.$router.push({path: `/singer/${singer.singer_mid}`})
            this.setSinger(singer)
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        })
    },
    components: {
        Loading, Listview, Taglist
    },
}
</script>
<style lang="less" scoped>
.singer{
    position: fixed;  width:100%;
    top: 2.5rem;bottom: 3rem;
    .tags{
        margin: 0.3rem;
        font-size: 16px;
    }
}
</style>


