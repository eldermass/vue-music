<template>
    <div class="search" ref="search">
        <div class="search-box-wrapper">
            <SearchBox ref="searchBox" @query='queryChange'></SearchBox>
        </div>
        <transition-group name="result-bar">
            <div class="search-wrapper" v-show="!queryShow" :key="1">
                <div class="hot-search" ref="hotSearch">
                    <h4>热门搜索</h4>
                    <ul style="height: 100%;width: 100%">
                        <li class="key-item" v-for="(val, index) in hotkeys" :key="index"
                            @click="addQuery(val.k)">
                            {{val.k}}
                        </li>
                    </ul>
                    <Loading v-show="!hotkeys.length" :mini='true'/>
                </div>
                <div class="search-history" v-show="searchHistory.length" ref="searchHistoryWrapper">
                    <ul>
                        <li class="history-title">
                            <p class="text">搜索历史</p>
                            <span class="iconfont icon-lajitong" @click="clearConfirm"></span>
                        </li>
                        <SearchList :dataList='searchHistory' ref="searchlist"
                        @selected='addQuery' @deleted='deleteHistory' ></SearchList>
                    </ul>
                </div>
            </div>
            <!-- 搜索结果 -->
            <div class="search-result" v-show="queryShow" :key="2" ref="searchResult">
                <Suggest :query='query' @beforescroll='listStartScroll' @selected='saveSearch'></Suggest>
            </div>
            <!-- /搜索结果 -->
        </transition-group>
        <Confirm ref="confirm" @confirm='clearSearchHistory'></Confirm>
    </div>
</template>
<script>
import SearchBox from '_c/searchbox'
import SearchList from '_c/searchlist'
import Confirm from '_c/confirm'
import Suggest from '_c/suggest'
import Loading from '_c/loading'
import { getHotKeys } from '@/api/search'
import { mapActions, mapGetters } from 'vuex'
import { playlistMixin } from '@/mixin'
export default {
    mixins: [playlistMixin],
    data() {
        return {
            hotkeys: [],
            query: '',
            queryShow: false,
            searchTimer: null
        }
    },
    created() {
        this.getHotKeyData()
    },
    methods: {
        setHistoryPosition() {
            let hotSearch = this.$refs.hotSearch.getBoundingClientRect()
            this.$refs.searchHistoryWrapper.style.top = hotSearch.height + 'px'
            // 重新计算滚动
            this.$refs.searchlist.refresh()
        },
        addQuery(val) {
            this.$refs.searchBox.setQuery(val)
        },
        deleteHistory(item) {
            this.deleteSearchHistory(item)
        },
        async getHotKeyData() {
            let data = await getHotKeys()
            this.hotkeys = data.hotkey.slice(0, 10)
        },
        queryChange(query) {
            clearTimeout(this.searchTimer)
            this.searchTimer = setTimeout(() => {
                if (query) {
                    this.query = query
                    this.queryShow = true
                } else {
                    this.queryShow = false
                }
            }, 200)
        },
        clearConfirm() {
            this.$refs.confirm.show()
        },
        listStartScroll() {
            this.$refs.searchBox.blur()
        },
        saveSearch() {
            this.saveSearchHistory(this.query)
        },
        handlePlaylist(list) {
            if (this.playlistLength) {
                this.$refs.searchHistoryWrapper.style.bottom = '3rem'
                this.$refs.searchResult.style.bottom = '3rem'
            } else {
                this.$refs.searchHistoryWrapper.style.bottom = ''
                this.$refs.searchResult.style.bottom = ''
            }
            this.$refs.searchlist.refresh()
        },
        ...mapActions(['saveSearchHistory', 'deleteSearchHistory', 'clearSearchHistory'])
    },
    watch:{
        queryShow () {
            
        },
        hotkeys (newHotKeys) {
            if (newHotKeys.length) {
                setTimeout(() => {
                    this.setHistoryPosition()
                }, 100)
            }
        }
    },
    computed: {
        ...mapGetters(['searchHistory'])
    },
    components: {
        SearchBox, Suggest, SearchList, Confirm, Loading
    }
}
</script>
<style lang="less" scoped>
.search{
    position: fixed; top: 0; bottom: 3rem;width: 100%;
    .search-box-wrapper{
        padding: .7rem 3rem;
    }
    .search-wrapper{
        position: absolute;top:3rem;bottom:0;width:100%;
        .hot-search{
            color: #999;
            padding: .5rem .7rem;
            h4{
                padding: .5rem;
            }
            .key-item{
                border-radius: 5px;display: inline-block;
                background: lighten(skyblue, 20%);
                margin: .2rem .5rem; padding: .2rem .4rem;
                &:hover{
                    cursor: pointer;
                    background: lighten(skyblue, 15%);                    
                }
            }
        }
        .search-history{
            position: absolute;
            top: 177px; 
            bottom: 0;
            width: 100%;
            color: steelblue;
            ul{
                height: 100%;
                .history-title{
                    border-bottom: 1px solid #dfdfdf;
                    padding: .5rem 2rem .5rem 1rem;
                    .text{
                        float: left;
                    }
                    .iconfont{
                        float: right;
                        font-size: 18px;
                    }
                    &:after{
                        display: block;
                        content: '';
                        clear: both
                    }
                }
            }
        }
    }
    .search-result{
        position: absolute;top:3rem;bottom:0;width:100%;
    }
}
.result-bar-enter-active,.result-bar-leave-active{
    transition: all .5s;
}
.result-bar-enter,.result-bar-leave-to{
    opacity: 0;
}
</style>
