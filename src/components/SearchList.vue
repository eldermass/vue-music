<template>
    <div class="search-list" ref="searchlist">
        <Scroll :singer='dataList' :otherHeight='otherHeight' ref="scroll">
        <ul>
            <li v-for="(item, index) in dataList" :key="index" class="item"
                @click="selectedItem(item)">
                <p class="text">{{item}}</p>
                <span class="iconfont icon-cha" @click.stop="deleteItem(item)"></span>
            </li>
        </ul>
        </Scroll>
    </div>
</template>
<script>
import Scroll from 'components/Scroll'
import {playlistMixin} from 'common/js/mixin'
export default {
    mixins: [playlistMixin],
    data(){
        return {
            pos: {},
            otherHeight: 0
        }
    },
    props: {
        dataList: {
            type: Array,
            default:() => []
        },
        addSong: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        if(this.addSong){
            this.$refs.searchlist.style.top = '0'
        }
    },
    methods:{
        setHeight() {
            this.pos = this.$refs.searchlist.getBoundingClientRect()
            this.otherHeight = this.pos.top - 38
            this.$refs.scroll.irefresh()
        },
        handlePlaylist() {
            if (this.playList.length) {
                this.otherHeight = this.pos.height + 28
                this.$refs.searchlist.style.height = this.pos.height - 48 + 'px'
                this.$refs.scroll.irefresh()
            }
        },
        selectedItem(item) {
            this.$emit('selected', item)
        },
        deleteItem(item) {
            this.$emit('deleted', item)
        },
        refresh() {
            this.otherHeight = 80
            this.$refs.scroll.irefresh()
        }
    },
    components: {
        Scroll
    }
}
</script>
<style lang="less" scoped>
.search-list{
    position: absolute; top: 2rem;bottom: 0;width: 100%;
    overflow: hidden;padding: 0 1.5rem 0 1rem;margin-top:.5rem;
    .item{
        padding: .2rem .5rem;
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
</style>

