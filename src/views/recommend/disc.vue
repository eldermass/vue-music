<template>
    <transition name="disc">
        <div class="disc">
            <Backicon />
            <Discview :bg-image='bgImg' :title='title' :songs='disclist'/>
        </div>
    </transition>
</template>
<script>
import Backicon from '_c/backicon'
import Discview from '_c/discview'
import { getDiscList } from '@/api/recommend'
import { createSong } from 'common/js/song'
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            disclist: []
        }
    },
    created() {
        if(!this.disc.dissid){
            this.$router.push({ 
                path: '/recommend'
            })
            return
        }
        this.getDiscListData()
    },
    methods: {
        async getDiscListData() {
            let data = await getDiscList(this.disc.dissid)
            let songlist = data.cdlist[0].songlist

            for (let i = 0; i < songlist.length; i++) {
                if (songlist[i].albummid && songlist[i].strMediaMid)
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
        Backicon, Discview
    }
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable.less';
.disc{
    position: fixed;
    top: 0;
    left: 0;bottom: @bottom-height;
    z-index: 10; width: 100%;
    background: lighten(@color-background, 24%);
}
.disc-enter-active,.disc-leave-active{
    transition: all 0.5s
}
.disc-enter,.disc-leave-to{
    opacity: 0;
    transform: translateX(100%)
}
</style>


