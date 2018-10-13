<template>
    <div class="header">
        <div class="back" v-show="headerback.path" @click="handleBack">
            <span class="iconfont icon-back"></span>
        </div>
        <img :src="themeImg">
        <h3>{{header}}</h3>
        <span :class="['iconfont',isUserPage?'icon-cha':'icon-mo']" @click="toggleUserPage"></span>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex'
export default {
    data() {
        return {
            src:'',
            isUserPage: false,
            lastHeader: ''
        }
    },
    computed: {
        ...mapGetters(['header','headerback','themeImg'])
    },
    methods: {
        handleBack() {
            this.$router.push({path: this.headerback.path})
            this.setHeaderTitle(this.headerback.header)
            this.setHeaderBack('')
        },
        ...mapMutations({
            setHeaderBack: 'SET_HEAD_BACK',
            setHeaderTitle: 'SET_HEAD_TITLE'
        }),
        toggleUserPage() {
            if(this.isUserPage){
                this.$router.back()
                this.setHeaderTitle(this.lastHeader)
            } else {
                this.lastHeader = this.header
                this.$router.push('/user')
                this.setHeaderTitle('user center')
            }
            this.isUserPage = !this.isUserPage
        }
    }
} 
</script>
<style lang="less" scoped>
@import '../../src/common/less/variable';
.header{
    .back{
        position: absolute;top: .5rem;left: 0;
        .icon-back{
            font-size: 20px;
            color: deepskyblue;
        }
    }
    .flex;
    position: fixed;z-index: 9999;
    top:0;left: 0;right: 0;
    height: @top-height;
    background: linear-gradient(@color-background,lighten(@color-background,13%),lighten(@color-background,10%),lighten(@color-background,13%),@color-background);
    img{
        height: 1.5rem;
        margin-right: .5rem;
    }
    .icon-mo,.icon-cha{
        position: absolute; right: .5rem; top: .5rem;
        font-size: 23px;color: steelblue;
        align-self: center;
    }
}
</style>
