<template>
<transition name='vol'>
    <div class="volume">
        <div class="volume-bar">
            <div class="volume-all"  ref="volAll"
                @touchstart.prevent='vTouchStart'
                @touchmove.prevent='vTouchMove'
                @touchend='vTouchEnd'>
            <div class="volume-now" ref="volNow">
                <div class="volume-btn"></div>
            </div>
            </div>
        </div>
    </div>
</transition>
</template>
<script>
export default {
    props: {
        precent: {
            type: Number,
            default: 50
        }
    },
    data () {
        return {
            isInitialed: false,
            touch: {},
            newPercent: 0
        }
    },
    mounted() {
        this.setVolHeight(this.precent)
    },
    methods: {
        vTouchStart(e) {
            this.isInitialed = true
            this.touch.startY = e.touches[0].pageY
            this.offsetTop = this.$refs.volAll.getBoundingClientRect().top
            this.touch.heightAll = 100
            this.newPercent = this.touch.heightAll - (this.touch.startY - this.offsetTop)
            this.setVolHeight(this.newPercent)
        },
        vTouchMove (e) {
            if(!this.isInitialed) 
                return
            let per = this.touch.heightAll - (e.touches[0].pageY - this.offsetTop)
            per = Math.max(0, Math.min(100, per))
            this.setVolHeight(per)
        },
        vTouchEnd () {
            this.isInitialed = false
        },
        setVolHeight(per) {
            this.$refs.volNow.style.height = per + '%'
            this.$emit('volume', per)
        }
    }
}
</script>
<style lang="less" scoped>
.volume{
    overflow: visible;
    .volume-bar{
        width: 4px;height: 100px;position: relative;
        .volume-all{
            background: #777;height: 100%;
            width: 4px;
            .volume-now{
                position: absolute;bottom: 0;
                height: 50%;width: 4px;
                background-color: skyblue;
                .volume-btn{
                    position: absolute; top: 0;
                    height: 10px;width: 10px; border-radius: 50%;
                    background-color: skyblue;
                    border: 1.5px solid white;
                    transform: translate(-3px, -3px)
                }
            }
        }
    }
}
.vol-enter-active, .vol-leave-active {
    transition: all .5s
}
.vol-enter,.vol-leave-to {
    opacity: 0;
}
</style>


