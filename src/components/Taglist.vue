<template>
    <div class="taglist" ref="taglist">
        <ul ref="ul">
            <li v-for="(tag, index) in data" :key="tag.id" :class="{active:curIndex == index}" @click="selectTag(tag.id, index)">
                {{tag.name}}
            </li>
        </ul>    
    </div>    
</template>
<script>
import BScroll from 'better-scroll'
export default {
    data() {
        return {
            curIndex: 0
        }
    },
    props: {
        data: {
            type: Array,
            default: null
        }
    },
    methods: {
        initScroll () {
            if(!this.$refs.taglist) return 
            if(!this.$refs.ul) return 
            this.$refs.ul.style.width = this.data.length * 45 + 'px'
            this.scroll = new BScroll(this.$refs.taglist, {
                probeType: this.probeType,
                click: this.click,
                scrollX: true
            })
        },
        selectTag(tagId, index){
            this.curIndex = index
            this.$emit('onselecttag', { tagId })
        }
    },
    watch:{
        data() {
            this.initScroll()
        }
    }
}
</script>
<style lang="less" scoped>
@import '../common/less/variable.less';
.taglist{
    ul{
        li{
            padding: 3px 5px;
            float: left;
        }
        .active{
            color: @color-background;
        }
        &:after{
            display: block;
            content: '';
            clear: both;
        }
    }
}
</style>

