<template>
    <div class="footer">
        <router-link tag='div' to='/recommend'>
            <span class="iconfont icon-yinle" @click="changePage('iMusic')"></span>
            <span>{{navData[0]}}</span>
        </router-link>
        <router-link tag='div' to='/singer'>
            <span class="iconfont icon-geshou" @click="changePage('Singer')"></span>
            <span>{{navData[1]}}</span>
        </router-link>
        <router-link tag='div' to='/rank'>
            <span class="iconfont icon-paixing" @click="changePage('Rank')"></span>
            <span>{{navData[2]}}</span>
        </router-link>
        <router-link tag='div' to='/search'>
            <span class="iconfont icon-faxian" @click="changePage('Search')"></span>
            <span>{{navData[3]}}</span>
        </router-link>
        <router-link tag='div' to='/user'>
            <span class="iconfont icon-mo" @click="changePage('user')"></span>
            <span>{{navData[3]}}</span>
        </router-link>
    </div>
</template>
<script>
import {mapMutations} from 'vuex'
export default {
    data() {
        return {
            navData:['推荐', '歌手', '排行', '搜索', '用户']
        }
    },
    methods:{
        changePage(str){
            this.changeHead(str)
            this.hideBackIcon({})
        },
        ...mapMutations({
            changeHead: 'SET_HEAD_TITLE',
            hideBackIcon: 'SET_HEAD_BACK'
        })
    }
}    
</script>
<style lang="less" scoped>
@import '../../src/common/less/variable';
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
