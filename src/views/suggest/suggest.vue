<template>
    <div class="suggest">
        <Scroll class="scroll-wrapper" :data='result' :otherRem='otherRem' ref="sugScroll" :pullup='true'
            @scrollToEnd='searchMore' :beforeScroll='true' @beforeScroll='beforeScroll'>
            <ul class="seggest-list">
                <li class="suggest-item" v-for="(item, index) in result" :key="index"
                    @click="selectItem(item)">
                    <span :class="['iconfont', getIcon(item.type)]"></span>
                    <p class="name" v-html="getTxt(item)"></p>
                </li>
                <li style="text-align:center;padding:.7rem" v-show="isMore">
                    <img :src="loadingImg" height="20" width="20">
                </li>
                <li v-show="!isMore && !this.result.length" style="text-align:center">
                    抱歉，没有搜索结果
                </li>
            </ul>
        </Scroll>
        <router-view v-show="showResult"></router-view>
    </div>
</template>
<script>
import { createSong } from 'common/js/song'
import Scroll from 'components/Scroll'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
export default {
    mixins:[playlistMixin],
    data() {
        return {
            page: 1,
            result: [],
            otherRem: 3,
            isMore: true,
            loadingImg: require('common/image/loading.gif'),
            showResult: false
        }
    },
    props: {
        query: {
            type: String,
            default: ''
        },
        showSinger: {
            type: Boolean,
            default: true
        },
        addSong: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        if(this.addSong){
            this.otherRem = .5
        }
    },
    activated(){
        this.showResult = false
    },
    methods: {
        beforeScroll() {
            this.$emit('listScroll')
        },
        selectItem(item) {
            if(item.type === 'singer'){
                this.showResult = true
                this.$router.push({
                    path: `/search/${item.singerid}`,
                    query: {
                        from: 'suggest'
                    }
                })
                this.setSinger({
                    singer_id: item.singerid,
                    singer_name: item.singername,
                    singer_pic: `http://y.gtimg.cn/music/photo_new/T001R150x150M000${item.singermid}.webp`
                })
            }else if(item.type === 'album'){

            } else {
                this.$store.dispatch('insertSong', item)
            }
            this.$emit('selected')
        },
        searchMore() {
            if(!this.isMore){
                return
            }
            this.page += 1
            this.getSearchData(true)
        },
        async getSearchData(second) {
            if(!second){
                this.page = 1
                this.isMore = true
                this.$refs.sugScroll.scrollTo(0, 0)
            }
            let res = await this.$get('/searching', {query: this.query, page: this.page})
            if(!res.data.song.list.length || 20 * res.data.song.curpage >= res.data.song.totalnum)
                this.isMore = false
            if(res.code === 0)
                if(!second)
                    this.result = this.getResultData(res.data)
                else
                    this.result = this.result.concat(this.getResultData(res.data))

            // console.log(res)
            // console.log(this.result)
        },
        getResultData(data) {
            let res = []
            if(data.zhida.type == 2 && this.showSinger)
                res.push({...data.zhida, ...{type: 'singer'}})
            if(data.zhida.type == 3 && this.showSinger)
                res.push({...data.zhida, ...{type: 'album'}})
            if(data.song.curnum)
                res = res.concat(this.makeSongs(data.song.list))
            return res
        },
        makeSongs(list) {
            let ret = []
            list.forEach(item => {
                if(item.songid && item.albumid)
                    ret.push(createSong(Object.assign({}, item,{strMediaMid: item.songmid})))
            })
            return ret
        },
        getTxt(item) {
            if(item.type === 'singer')
                return item.singername
            if(item.type === 'album')
                return item.albumname
            if(!item.type) {
                let singer = ''
                item.singer.forEach((val, index) => {
                    if(!index)
                        singer = val.name
                    else
                        singer += `/${val.name}`
                })
                return `${item.name} - ${singer}`
            }
        },
        getIcon(type) {
            if(type === 'singer')
                return 'icon-geshou'
            else if(type === 'album')
                return 'icon-zhuanji'
            else
                return 'icon-yinle'
        },
        handlePlaylist() {
            let otherRem = this.playList.length ? 6.5 : 3
            if(otherRem === 6.5 && !this.addSong){
                this.otherRem = otherRem
                this.$emit('changeh')
                this.$refs.sugScroll.refresh()
            }
        },
        ...mapMutations({
            setSinger: 'SET_SINGER',
            setHeaderBack: 'SET_HEAD_BACK'
        })
    },
    watch: {
        query() {
            this.getSearchData()
        }
    },
    components: {
        Scroll
    }
}
</script>
<style lang="less" scoped>
.suggest{
    width: 100%;height: 100%;
    padding: 0 .5rem;
    .scroll-wrapper{
        height: 100%;
        .seggest-list{
            .suggest-item{
                display: flex; align-items: center;
                padding: .2rem 1rem;
                .iconfont{
                    font-size: 20px;
                    color: #888;
                    transform: translateY(1px);
                }
                .icon-zhuanji{
                    transform: translateY(0)
                }
                .name{
                    flex-grow: 1;line-height: 22px;
                    padding-left: .7rem;
                    overflow: hidden;text-overflow: ellipsis;white-space: nowrap;
                }
            }
        }
    }
}
</style>


