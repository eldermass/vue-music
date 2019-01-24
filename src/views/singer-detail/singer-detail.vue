<template>
    <transition name="singer">
        <div class="singer-detail">
            <Backicon />
            <Discview :songs='songs' :bg-image='singer.singer_pic' :title='singer.singer_name' 
                :more='true' @getmoresong='getMoreSongs'/>
            <!-- <MusicList :songs='songs' :bg-image='singer.singer_pic' :title='singer.singer_name' 
            @getmoresong='getMoreSongs' :backto="backto"></MusicList> -->
        </div>
    </transition>
</template>
<script>
import Backicon from '_c/backicon'
import Discview from '_c/discview'
import { mapGetters } from 'vuex'
import { getSingerSongs } from '@/api/singer'

import { createSong } from 'common/js/song'
export default {
    data() {
        return {
            page: 0,
            songs: []
        }
    },
    mounted() {
        this.getSongsList()
    },
    methods: {
        async getSongsList (notFirst) {
            if (!this.singer.singer_id) 
                this.$router.back()
            // 首次获取
            if (!notFirst) this.page = 0
            let data = await getSingerSongs(this.singer.singer_id, this.page)

            let list = data.list
            let songs = []
            // 本次获得的歌曲
            if (!list) return 
            for(let i = 0; i < list.length; i++){
                if(list[i].musicData.albummid && list[i].musicData.strMediaMid)
                        songs.push(createSong(list[i].musicData))
            }
            if(notFirst){
                this.songs = this.songs.concat(songs)
            }else{
                this.songs = songs
            }

        },
        getMoreSongs() {
            // 加一页歌曲
            this.page++
            this.getSongsList(true)
        }
    },
    computed: {
        ...mapGetters(['singer'])
    },
    components:{
        Backicon, Discview
    }
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable.less';
.singer-detail{
    position: fixed;bottom: @bottom-height;
    top: 0; left: 0;
    z-index: 10;
    width: 100%;
    background: lighten(@color-background, 24%);
}
.singer-enter-active,.singer-leave-active{
    transition: all 0.5s
}
.singer-enter,.singer-leave-to{
    opacity: 0;
    transform: translateX(100%)
}
</style>


