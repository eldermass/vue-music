<template>
    <transition name="singer">
        <div class="singer-detail">
            <MusicList :songs='songs' :bg-image='singer.singer_pic' :title='singer.singer_name' 
            @getmoresong='getMoreSongs' :backto="backto"></MusicList>
        </div>
    </transition>
</template>
<script>
import { mapGetters } from 'vuex'
import { createSong } from 'common/js/song'
import MusicList from 'components/MusicList'
export default {
    data() {
        return {
            page: 0,
            songs: [],
            backto: {path:'/singer',header:'Singer'}
        }
    },
    mounted() {
        if(this.$route.query.from === 'suggest')
            this.backto = {path:'/search',header:'Search'}
        this.getSingerSongs(this.singer.singer_id)
    },
    methods: {
        async getSingerSongs(id, notFirst) {
            if(!id){
                this.$router.push({path: this.backto.path})
                return
            }
            if(!notFirst) this.page = 0

            let res = await this.$get('/singersongs', { id, page: this.page })
            // 整理需要的数据
            let list = res.data.list
            let songs = []
            for(let i = 0; i < list.length; i++){
                if(list[i].musicData.albummid && list[i].musicData.strMediaMid)
                        songs.push(createSong(list[i].musicData))
                
            }
            if(notFirst){
                this.songs = this.songs.concat(songs)
            }else{
                this.songs = songs
            }
            // console.log(this.songs)
        },
        getMoreSongs() {
            // 加一页歌曲
            this.page++
            this.getSingerSongs(this.singer.singer_id, true)
        }
    },
    computed: {
        ...mapGetters(['singer'])
    },
    components:{
        MusicList
    }
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable.less';
.singer-detail{
    position: fixed;bottom: @bottom-height;
    top: @top-height; left: 0;
    z-index: 10;
    width: 100%;
    background: lighten(@color-background, 24%);
    &::after{
        content: '';
        display: block;
        clear: both;
    }
}
.singer-enter-active,.singer-leave-active{
    transition: all 0.5s
}
.singer-enter,.singer-leave-to{
    opacity: 0;
    transform: translateX(100%)
}
</style>


