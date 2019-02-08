<template>
    <div class="suggest">
        <Scroll class="scroll-wrapper" :data='result' ref="scroll" 
            :pullupload='true' @scrollToEnd='searchMoreSong'
            :beforeScroll='true' @beforescroll='scrollStart'>
            <ul class="seggest-list">
                <li class="suggest-item" v-for="(item, index) in result" :key="index"
                    @click="selectItem(item)">
                    <span :class="['iconfont', getIcon(item.type)]"></span>
                    <p class="name" v-html="getTxt(item)"></p>
                </li>
                <Loading :mini='true' v-show="ismore"/>
                <li v-show="!ismore && !this.result.length" style="text-align:center">
                    抱歉，没有搜索结果
                </li>
            </ul>
        </Scroll>
        <router-view v-show="showResult"></router-view>
    </div>
</template>
<script>
import Scroll from '_c/scroll'
import Loading from '_c/loading'
import { getSearchRes } from '@/api/search'
import { createSong } from 'common/js/song'
import { mapMutations } from 'vuex'
export default {
    props: {
        query: {
            type: String,
            default: ''
        },
        showSinger: {
            type: Boolean,
            default: true
        },
        showAlbum: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            page: 0,
            ismore: true,
            result: [],
            showResult: false
        }
    },
    activated(){
        this.showResult = false
    },
    methods: {
        scrollStart () {
            this.$emit('beforescroll')
        },
        selectItem (item) {
            if(item.type === 'singer'){
                this.showResult = true
                this.SET_SINGER({
                    singer_id: item.singerid,
                    singer_name: item.singername,
                    singer_pic: `http://y.gtimg.cn/music/photo_new/T001R150x150M000${item.singermid}.webp`
                })
                this.$router.push({
                    path: `/search/${item.singerid}`
                })
            }else if(item.type === 'album'){
                console.log(item)
                return
            } else {
                this.$store.dispatch('insertSong', item)
            }
            this.$emit('selected')
        },
        searchMoreSong () {
            if (!this.ismore) return
            this.page += 1
            this.getSearchResult(true)
        },
        async getSearchResult (notFirst) {
            // 首次
            if(!notFirst){
                this.page = 1
                this.ismore = true
            }
            let data = await getSearchRes(this.query, this.page)
            
            if(!data.song.list.length || 20 * data.song.curpage >= data.song.totalnum)
                this.ismore = false

            if(!notFirst)
                this.result = this.formatResult(data, true)
            else
                this.result = this.result.concat(this.formatResult(data))
            this.$nextTick(() => {
                this.$refs.scroll.refresh()
            })
        },
        formatResult (data, first) {
            let res = []
            if(data.zhida.type == 2 && this.showSinger && first)
                res.push({...data.zhida, ...{type: 'singer'}})
            if(data.zhida.type == 3 && this.showAlbum && first)
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
        ...mapMutations(['SET_SINGER'])
    },
    watch: {
        query (newQuery) {
            this.getSearchResult()
        }
    },
    components: {
        Scroll, Loading
    }
}
</script>
<style lang="less" scoped>
.suggest{
    width: 100%;height: 100%;
    padding: .5rem .5rem 0 .5rem;
    overflow: hidden;
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
