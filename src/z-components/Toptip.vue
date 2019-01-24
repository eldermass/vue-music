<template>
    <transition name='drop'>
        <div class="top-tip" v-show="showFlag" @click.stop="hide">
            <slot></slot>
        </div>
    </transition>
</template>
<script>
export default {
    props: {
        delay: {
            type: Number,
            default: 2000
        }
    },
    data() {
        return {
            showFlag: false,
            timer: null
        }
    },
    methods: {
        show() {
            this.showFlag = true
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.hide()
            }, this.delay);
        },
        hide() {
            this.showFlag = false
        }
    }
}
</script>
<style lang="less" scoped>
.top-tip{
    position: fixed; top:0 ; width: 100%; height: 3rem;z-index: 10000;
    text-align: center;background: rgba(0,0,0,.7);color: skyblue;
    display:flex;align-items:center;justify-content:center;font-size: 18px;
}
.drop-enter-active, .drop-leave-active{
    transition: all .3s
}
.drop-enter,.drop-leave-to{
    transform: translateY(-100%)
}
</style>
