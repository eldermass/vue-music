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
        <div class="search-result" v-show="queryShow" :key="2">
            <Suggest :query='query' @changeh='changeHeight' @listScroll='listScroll'
             @selected='saveSearch'></Suggest>
        </div>
        </transition-group>
        <Confirm ref="confirm" @confirm='clearSearchHistory'></Confirm>
    </div>
</template>
<script>
import Confirm from 'components/Confirm'
import SearchBox from 'components/SearchBox'
import SearchList from 'components/SearchList'
import Suggest from '@/views/suggest/suggest'
import {mapActions, mapGetters} from 'vuex'
export default {
    data() {
        return {
            hotkeys: [],
            query: '',
            queryShow: false,
            searchTimer: null
        }
    },
    created() {
        this.getHotKey()
    },
    methods: {
        clearConfirm() {
            this.$refs.confirm.show()
        },
        deleteHistory(item) {
            this.deleteSearchHistory(item)
        },
        setHistoryHeight() {
            let hotSearch = this.$refs.hotSearch.getBoundingClientRect()
            this.$refs.searchHistoryWrapper.style.top = hotSearch.height + 'px'
        },
        saveSearch() {
            this.saveSearchHistory(this.query)
        },
        listScroll() {
            this.$refs.searchBox.blur()
        },
        async getHotKey() {
            let res = await this.$get('/hotkey')
            this.hotkeys = res.data.hotkey.slice(0, 10)
        },
        addQuery(val) {
            this.$refs.searchBox.setQuery(val)
        },
        queryChange(query) {
            clearTimeout(this.searchTimer)
            this.searchTimer = setTimeout(() => {
                if(query){
                    this.query = query
                    this.queryShow = true
                }else{
                    this.queryShow = false
                }
            }, 200)
        },
        changeHeight() {
            this.$refs.search.style.bottom = `6rem`
        },
        ...mapActions(['saveSearchHistory', 'deleteSearchHistory', 'clearSearchHistory'])
    },
    watch:{
        queryShow() {
            this.$refs.searchlist.handlePlaylist()
        },
        hotkeys() {
            this.$nextTick(() => {
                this.setHistoryHeight()
                this.$refs.searchlist.setHeight()
            })
        }
    },
    computed: {
        ...mapGetters(['searchHistory'])
    },
    components: {
        SearchBox, Suggest, SearchList, Confirm
    }
}
</script>
<style lang="less" scoped>
.search{
    position: fixed; top: 2.5rem; bottom: 3rem;width: 100%;
    .search-box-wrapper{
        padding: .5rem 3rem;
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
            position: absolute;bottom: 0;top: 0; width: 100%;
            color: steelblue;
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
