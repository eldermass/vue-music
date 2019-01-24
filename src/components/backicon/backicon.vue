<template>
    <span class="iconfont icon-back" @click="goBack"></span>
</template>
<script>
export default {
    methods: {
        goBack () {
            this.$router.back()
        }
    },
}
</script>
<style lang="less" scoped>
    .iconfont{
        position: absolute;
        top: 10px;
        left: 10px;
        font-size: 20px;
        z-index: 10;
        color: #00bfff;
        text-shadow: 0 0 4px #fff;
    }
</style>
