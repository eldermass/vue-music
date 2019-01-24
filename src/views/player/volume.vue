<template>
    <div class="volume">
        <transition name='vol'>
            <div class="volume-bar" v-show="volbarShow">
                <div class="volume-all"  ref="volAll"
                    @touchstart.prevent='vTouchStart'
                    @touchmove.prevent='vTouchMove'
                    @touchend='vTouchEnd'>
                    <div class="volume-now" ref="volNow">
                        <div class="volume-btn"></div>
                    </div>
                </div>
            </div>
        </transition>
        <span :class="['iconfont', volumnIcon]" @click="toggleBarShow"></span>
    </div>
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
            newPercent: 50,
            timer: null,
            volbarShow: false
        }
    },
    mounted() {
        this.setVolHeight(this.precent)
    },
    methods: {
        toggleBarShow () {
            this.volbarShow = !this.volbarShow
        },
        handleHoverBarShow (isDown) {
            if (isDown) {
                clearTimeout(this.timer)
            } else {
                this.timer = setTimeout(() => {
                    this.volbarShow = false
                }, 2500);
            }
        },
        vTouchStart(e) {
            this.handleHoverBarShow(true)
            this.isInitialed = true
            this.touch.startY = e.touches[0].pageY

            this.offsetTop = this.$refs.volAll.getBoundingClientRect().top
            this.touch.heightAll = 100
            this.newPercent = this.touch.heightAll - (this.touch.startY - this.offsetTop)
            this.setVolHeight(this.newPercent)
        },
        vTouchMove (e) {
            if (!this.isInitialed) 
                return
            let per = this.touch.heightAll - (e.touches[0].pageY - this.offsetTop)
                per = Math.max(0, Math.min(100, per))
            if (this.newPercent === per) 
                return
            this.newPercent = per
            this.setVolHeight(per)
        },
        vTouchEnd () {
            this.isInitialed = false
            this.handleHoverBarShow()

        },
        setVolHeight(per) {
            this.$refs.volNow.style.height = per + '%'
            this.$emit('volume', per)
        }
    },
    computed: {
        volumnIcon () {
            return this.newPercent === 0 ? 'icon-shengyinjingyinmianxing' : 'icon-shengyinyinliangmianxing'
        }
    },
    watch: {
        volbarShow (state) {
            if (state) {
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.volbarShow = false
                }, 2500);
            }
        }
    }
}
</script>
<style lang="less" scoped>
.volume{
    display: flex;flex-direction: column;align-items: center;
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
    .iconfont {
        padding-top: 10px; 
    }
}
.vol-enter-active, .vol-leave-active {
    transition: all .5s
}
.vol-enter,.vol-leave-to {
    opacity: 0;
}
</style>


