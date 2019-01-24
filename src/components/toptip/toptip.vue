<template>
    <transition name='toptip'>
        <div class="toptip" v-show="showFlag" @click.stop="hide">
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
    data () {
        return {
            showFlag: false,
            timer: null
        }
    },
    methods: {
        show () {
            this.showFlag = true
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.showFlag = false
            }, this.delay);
        },
        hide () {
            this.showFlag = false
        }
    },
}
</script>
<style lang="less" scoped>
.toptip{
    position: fixed; top:0 ; width: 100%; height: 3rem;z-index: 10000;
    text-align: center;background: rgba(0,0,0,.6);color: skyblue;
    display:flex;align-items:center;justify-content:center;font-size: 18px;
}
.toptip-enter-active, .toptip-leave-active{
    transition: all .3s
}
.toptip-enter,.toptip-leave-to{
    transform: translateY(-100%)
}
</style>
