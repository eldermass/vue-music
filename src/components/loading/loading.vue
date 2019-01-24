<template>
    <div class="loading" v-if="!mini">
        <img :src="require('@/common/image/loading.gif')" height="60" width="60">
        <p class="title">{{title}}</p>
    </div>
    <div class="mini" v-else>
        <img :src="require('@/common/image/loading.gif')" height="25" width="25">
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: '数据加载中...'
        },
        mini: {
            type: Boolean,
            default: false
        }
    }
}
</script>
<style lang="less" scoped>
.loading {
    width: 100%;
    text-align: center;
    background-color: lighten(skyblue, 24%);
    position: relative;
    z-index: 999;
    .title{
        line-height: 20px;
    }
}
.mini {
    text-align: center;
}
</style>
