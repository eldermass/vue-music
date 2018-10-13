<template>
    <transition name='addsong'>
        <div class="add-song" @click.stop v-show="showFlag">
            <div class="header">
                <span class="iconfont icon-cha" @click="hide"></span>
                <p class="title">添加歌曲到列表</p>
            </div>
            <div class="search-box-wrapper">
                <SearchBox placeholder='收索歌曲' @query='queryChange' ref="searchBox"></SearchBox>
            </div>
            <div class="shortcut" v-show="!queryShow">
                <Switches :datas="['最近播放', '搜索历史']" @switch='switchCut'></Switches>
            <transition-group name='slide-in'>
                <Songlist :songs='playHistory' :otherHeight='0' :otherRem='3' :music='false' v-show="showPlayHis"
                :resetTop='true' style='overflow:hidden' ref="songlist" @select="selectHistorySong" :key="1"></Songlist>
                <div class="searchlist" v-show="!showPlayHis" :key="2">
                    <SearchList :dataList='searchHistory' ref="searchlist"
                    @deleted='deleteHistory'  @selected='addQuery' :addSong='true'></SearchList>
                </div>
            </transition-group>
            </div>
            <div class="search" v-show="query && queryShow">
                <Suggest :query='query' :addSong='true' :showSinger='false' @selected="selectItem"
                    @listScroll='listScroll'></Suggest>
            </div>
            <Toptip ref="toptip">
                <div class="top-tip" style="display:flex;align-items:center;justify-content:center">
                    <span class="iconfont icon-dui" style="padding: 0 .3rem"></span>
                    <p class="text">歌曲已添加到列表</p>
                </div>
            </Toptip>
        </div>
    </transition>
</template>
<script>
import SearchList from 'components/SearchList'
import SearchBox from 'components/SearchBox'
import Songlist from 'components/Songlist'
import Suggest from '../suggest/suggest'
import Switches from 'components/Switches'
import Toptip from 'components/Toptip'
import {searchMix} from 'common/js/mixin'
import {mapGetters, mapActions} from 'vuex'
export default {
    mixins: [searchMix],
    data() {
        return {
            showFlag: false,
            query: '',
            queryShow: false,
            showPlayHis: true
        }
    },
    methods: {
        showToptip() {
            this.$refs.toptip.show()
        },
        switchCut(index) {
            if(index === 0){
                this.showPlayHis = true
            } else {
                this.showPlayHis = false
                this.$refs.searchlist.refresh()
            }
        },
        refresh() {
            this.$refs.songlist.refresh()
        },
        show() {
            this.showFlag = true
        },
        hide() {
            this.showFlag = false
        },
        selectItem() {
            this.hide()
            this.$emit('selectedsong')
            this.saveSearchHistory(this.query)
            this.showToptip()
        },
        selectHistorySong(song, index) {
            if( index !== 0){
                this.insertSong(song)
                this.showToptip()
            }
        },
        ...mapActions(['insertSong'])
    },
    computed: {
        ...mapGetters(['playHistory', 'searchHistory'])
    },
    components: {
        SearchBox, Suggest, Switches, Songlist, SearchList, Toptip
    }
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable.less';
.add-song{
    position: fixed; top: 0; bottom: 0; width: 100%;
    background: @light-background;
    .header{
        font-size: 20px;height: 3rem;line-height: 3rem;
        text-align: center;
        .iconfont{
            font-size: 20px;
            float: right;
            transform: translate(-10px, 0);
        }
    }
    .search-box-wrapper{
        padding: .2rem 3rem;
    }
    .shortcut{
        position: absolute;bottom: 0;top: 6rem;width: 100%; overflow: hidden;
        .searchlist{
            position: absolute;top: 3rem;bottom: 0;width: 100%;
        }
    }
    .search{
        position: absolute; top: 6rem; bottom:0;width: 100%;
    }
}
.addsong-enter-active,.addsong-leave-active{
    transition: all .3s;
}
.addsong-enter,.addsong-leave-to{
    transform: translateY(100%);
    opacity: 0;
}

.slide-in-enter-active{
    transition: all .3s;
}
.slide-in-enter,.slide-in-leave-to{
    transform: translateX(100%);
    opacity: 0;
}
</style>
