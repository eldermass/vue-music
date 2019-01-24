<template>
    <div class="search-list" ref="searchlist">
        <Scroll class="search-scroll-wrapper" :data='dataList' ref="scroll">
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
import Scroll from '_c/scroll'

export default {
    props: {
        dataList: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        refresh () {
            this.$refs.scroll.refresh()
        },
        selectedItem (item) {
            this.$emit('selected', item)
        },
        deleteItem (item) {
            this.$emit('deleted', item)
        }
    },
    components: {
        Scroll
    }
}
</script>
<style lang="less" scoped>
.search-list{
    height: 100%;
    overflow: hidden;padding: .5rem 1.5rem 40px 1rem;
    .search-scroll-wrapper{
        height: 100%;
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
}
</style>
