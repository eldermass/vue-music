<template>
    <transition name="disc">
        <div class="disc">
            <MusicList  :bg-image='bgImg' :title='title' :songs='disclist' :musicMore='false'
            ></MusicList>
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
            disclist: []
        }
    },
    created() {
        this.getDiscList()
    },
    methods: {
        async getDiscList() {
            if(!this.disc.dissid){
                this.$router.push({path: '/recommend'})
                return
            }
            let res = await this.$get('/disclist', {dissid: this.disc.dissid})
            let songlist = res.data.cdlist[0].songlist
            for(let i = 0; i < songlist.length; i++){
                if(songlist[i].albummid && songlist[i].strMediaMid)
                    this.disclist.push(createSong(songlist[i]))
            }
        }
    },
    computed: {
        ...mapGetters(['disc']),
        title() {
            return this.disc.dissname
        },
        bgImg() {
            return this.disc.imgurl
        }
    },
    components:{
        MusicList
    }
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable.less';
.disc{
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
.disc-enter-active,.disc-leave-active{
    transition: all 0.5s
}
.disc-enter,.disc-leave-to{
    opacity: 0;
    transform: translateX(100%)
}
</style>


