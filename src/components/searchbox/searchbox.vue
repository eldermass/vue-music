<template>
    <div class="search-box">
        <span class="iconfont icon-soushuo"></span>
        <input type="text" ref="query" class="box" :placeholder="placeholder"
            v-model="query">
        <span :class="['iconfont','icon-quxiao',{'nocancel': !query}]" 
            @click="clearBox"></span>
    </div>
</template>
<script>
export default {
    props: {
        placeholder: {
            type: String,
            default: '搜索歌曲、歌手'
        }
    },
    data () {
        return {
            query: ''
        }
    },
    methods: {
        clearBox () {
            this.query = ''
        },
        setQuery(query) {
            this.query = query
        },
        blur() {
            if(document.activeElement.className === 'box')
                this.$refs.query.blur()
        }
    },
    watch: {
        query (newQuery) {
            this.$emit('query', newQuery)
        }
    },
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable.less';
@color: lighten(@color-background, 18%);
.search-box{
    .flex;border-radius:5px;
    padding: 0 .3rem;
    background: @color;
    .iconfont{
        padding: .5rem;
        color: #666;
        transition: all .3s;
    }
    .box{
        padding: .3rem 0 .3rem .5rem;
        background-color: @color;
        border: none;
        outline: none;
        color: steelblue;
        font-size: 15px; 
    }
    .nocancel{
        color: @color
    }
}
</style>
