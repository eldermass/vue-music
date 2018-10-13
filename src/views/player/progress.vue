<template>
    <div class="progress">
        <div class="progress-bar">
            <div class="progress-all" ref='proAll' 
                @touchstart.prevent='proTouchStart'
                @touchmove.prevent='proTouchMove'
                @touchend='proTouchEnd'>
            <div class="progress-now" ref="proNow">
                <div class="progress-btn"></div>
            </div>
            </div>
        </div>
    </div>    
</template>
<script>
export default {
    data() {
        return {
            initiated: false,
            touch: {},
            newPercent: 0
        }
    },
    props: {
        percent: {
            type: Number,
            default: 0
        }
    },
    methods: {
        proTouchStart(e) {
            this.initiated = true
            this.touch.startX = e.touches[0].pageX
            this.offsetLeft = this.$refs.proAll.getBoundingClientRect().left
            this.totalWidth = this.$refs.proAll.clientWidth
            this.newPercent = (this.touch.startX - this.offsetLeft) / this.totalWidth
            this.getProgress(this.newPercent)
        },
        proTouchMove(e) {
            if(!this.initiated) return
            let per = (e.touches[0].pageX - this.offsetLeft) / this.totalWidth
            this.newPercent  = Math.min(1, Math.max(0, per))
            this.getProgress(this.newPercent)
        },
        proTouchEnd() {
            this.initiated = false
            this.$emit('changepercent', this.newPercent)
        },
        getProgress(per) {
            let percentNow = (per*100).toFixed(1) 
            this.$refs.proNow.style.width = percentNow + '%'
        }
    },
    watch: {
        percent(per) {
            if(per > 0 && !this.initiated)
                this.getProgress(per)
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable.less';
.progress{
    .progress-bar{
        height: 5px;width: 100%;
        position: relative;
        .progress-all{
            position: absolute;left: 0;top: 0;
            background: #777;
            height: 5px;width: 100%;
        }
        .progress-now{
            position: absolute;left: 0;top: 0;
            background: @color-background;
            height: 5px;
            .progress-btn{
                height: 15px;width: 15px;
                position: absolute;right: 0;top: 0;
                background: @color-background;
                transform: translate(5px, -5px);
                border-radius: 50%;
                border: 4px solid white;
            }
        }
    }
}

</style>


