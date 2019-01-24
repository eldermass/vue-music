<template>
    <ul class="switch">
        <li v-for="(item, index) in datas" :key="index" :class="['item', {'active': currentIndex === index}]"
            @click="selectItem(index)">
            <span>{{item}}</span>
        </li>    
    </ul>  
</template>
<script>
export default {
    props: {
        datas: {
            type: Array,
            default: () => []
        },
        index: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            currentIndex: 0
        }
    },
    mounted () {
        this.currentIndex = this.index
    },
    methods: {
        selectItem (index) {
            this.currentIndex = index
            this.$emit('switch', index)
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable.less';
.switch{
    display: flex;align-items: center; justify-content: center;
    .item{
        padding: 3px 6px;border-radius: 2px;
        border: 1px solid @color-background;
    }
    .active{
        background: @color-background;
        color: white;
    }   
}
</style>
