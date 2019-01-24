<template>
    <transition name='toplist'>
        <div class="toplist">
            <!-- <MusicList :title="toplist.topTitle" :bg-image="toplist.picUrl" :songs='topSongs'
            :backto="{path:'/rank',header:'Rank'}" :rank='true'
            :musicMore='false'></MusicList> -->
            <Backicon />
            <Discview :title="toplist.topTitle" :bg-image="toplist.picUrl" :songs='topSongs'
                :rank='true'/>
        </div>
    </transition>
</template>
<script>
import { getToplist } from '@/api/rank'
import Discview from '_c/discview'
import Backicon from '_c/backicon'
import { mapGetters } from 'vuex'

import { createSong } from 'common/js/song'
export default {
    data() {
        return {
            topSongs: []
        }
    },
    created() {
        this.getToplistData()
    },
    methods:{
        async getToplistData() {
            if(!this.toplist.id){
                this.$router.push({
                    path: '/rank'
                })
                return
            }
            let data = await getToplist(this.toplist.id)
            // console.log(res)
            let list = data.songlist
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
        Discview, Backicon
    }
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable.less';
.toplist{
    position: fixed;
    top: 0; left: 0;bottom: @bottom-height;
    z-index: 10; width: 100%;
    background: lighten(@color-background, 24%);
}
.toplist-enter-active,.toplist-leave-active{
    transition: all 0.5s
}
.toplist-enter,.toplist-leave-to{
    opacity: 0;
    transform: translateX(100%)
}
</style>


