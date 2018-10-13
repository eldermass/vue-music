<template>
    <transition name='toplist'>
        <div class="toplist">
            <MusicList :title="toplist.topTitle" :bg-image="toplist.picUrl" :songs='topSongs'
            :backto="{path:'/rank',header:'Rank'}" :rank='true'></MusicList>
        </div>
    </transition>
</template>
<script>
import MusicList from 'components/MusicList'
import {mapGetters} from 'vuex'
import {createSong} from 'common/js/song'
export default {
    data() {
        return {
            topSongs: []
        }
    },
    created() {
        this.getToplist()
    },
    methods:{
        async getToplist() {
            if(!this.toplist.id){
                this.$router.push({path: '/rank'})
                return
            }
            let res = await this.$get('/ranklistsongs',{topid: this.toplist.id})
            // console.log(res)
            let list = res.data.songlist
            let topSongs = []
            for(let i = 0; i < list.length; i++){
                if(list[i].data.albummid && list[i].data.strMediaMid)
                    topSongs.push(createSong(list[i].data))
            }
            this.topSongs = topSongs
        }
    },
    computed: {
        ...mapGetters(['toplist'])
    },
    components: {
        MusicList
    }
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable.less';
.toplist{
    position: fixed;
    top: @top-height; left: 0;bottom: @bottom-height;
    z-index: 10; width: 100%;
    background: lighten(@color-background, 24%);
    // background: skyblue; 
    &::after{
        content: '';
        display: block;
        clear: both;
    }
}
.toplist-enter-active,.toplist-leave-active{
    transition: all 0.5s
}
.toplist-enter,.toplist-leave-to{
    opacity: 0;
    transform: translateX(100%)
}
</style>


