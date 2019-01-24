<template>
    <div class="footer">
        <router-link :to='{name: item.toName}' tag="div" v-for="(item, index) in navData" :key="index">
            <span :class="['iconfont', item.icon]"></span>
            <span>{{ item.title}}</span>
        </router-link>
    </div>
</template>
<script>
export default {
    data() {
        return {
            navData:[{
                icon: 'icon-yinle',
                title: '推荐',
                toName: 'recommend'
            }, {
                icon: 'icon-geshou',
                title: '歌手',
                toName: 'singer'
            }, {
                icon: 'icon-paixing',
                title: '排行',
                toName: 'rank'
            }, {
                icon: 'icon-faxian',
                title: '搜索',
                toName: 'search'
            }, {
                icon: 'icon-mo',
                title: '用户',
                toName: 'user'
            }]
        }
    },
    methods: {
        
    },
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable';
.footer{
    .flex;z-index: 9999;
    justify-content: space-around;
    height: @bottom-height;
    position: fixed;
    border-top:1px solid @color-background;
    bottom:0;left: 0;right: 0;
    background:lighten(@color-background,25%);
    div{
        color: @color-font;
        display: flex;
        flex-direction: column;
        align-items: center;
        span:first-of-type{
            font-size: @small-font * 2
        }
        span:last-of-type{
            font-size: @small-font;
        }
    }
    .router-link-active{
        color: @color-background
    }
}
</style>
