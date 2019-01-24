<template>
    <div class="loading">
        <img src="../common/image/loading.gif" height="60" width="60">
        <p class="title">{{title}}</p>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: '正在加载中...'
        }
    }    
}
</script>
<style lang="less" scoped>
.loading{
    width: 100%;
    text-align: center;
    .title{
        line-height: 20px;
    }
}
</style>

