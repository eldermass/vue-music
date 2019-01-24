<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
    props:{
        probeType: {
            type: Number,
            default: 1
        },
        click: {
            type: Boolean,
            default: true
        },
        data: {
            type: Array,
            default: null
        },
        singer: {
            type: Array,
            default: null
        },
        listenScroll: {
            type: Boolean,
            default: false
        },
        otherHeight: {
            type: Number,
            default: 0
        },
        otherRem: {
            type: Number,
            default: 0
        },
        pullup: {
            type: Boolean,
            default: false
        },
        beforeScroll: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        setTimeout(() => {
            this.initScroll()
        }, 20)
    },
    methods: {
        initScroll () {
            if(!this.$refs.wrapper)
                return 
            this.scroll = new BScroll(this.$refs.wrapper, {
                probeType: this.probeType,
                click: this.click
            })
            if(this.listenScroll){
                this.scroll.on('scroll', pos => {
                    this.$emit('scrolling', pos)
                })
            }
            if(this.pullup){
                // 监听滚动停止的事件
                this.scroll.on('scrollEnd', () => {
                    if(this.scroll.y < this.scroll.maxScrollY + 50)
                        this.$emit('scrollToEnd')
                })
            }
            if(this.beforeScroll){
                this.scroll.on('beforeScrollStart',() => {
                    this.$emit('beforeScroll')
                })
            }
        },
        enable () {
            this.scroll && this.scroll.enable()
        },
        disable () {
            this.scroll && this.scroll.disable()
        },
        refresh () {
            this.scroll && this.scroll.refresh()
        },
        irefresh () {
            setTimeout(() => {
                let height = this.getHeight()
                // this.$refs.wrapper.style.height = height  + 'px'
                this.scroll && this.scroll.refresh()
            }, 20);
        },
        scrollTo () {
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        scrollToElement () {
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        },
        getHeight () {
            let toTop = this.$refs.wrapper.offsetTop
            let allHeight = window.innerHeight
            let boxheight = parseInt(window.getComputedStyle(document.getElementsByTagName('html')[0]).fontSize)
                             * (5.5 + this.otherRem)

            let height = allHeight - toTop - boxheight - this.otherHeight
            return height
        }
    },
    watch: {
        data () {
            console.log('data change')
            setTimeout(() => {
                // let height = this.getHeight()
                // this.$refs.wrapper.style.height = height  + 'px'
                // this.$refs.wrapper.style.overflow = 'hidden'
                this.refresh()
            }, 20)
        },
        singer() {
            // let height = this.getHeight()
            // this.$refs.wrapper.style.height = height  + 'px'
            // this.refresh()
        },
        otherRem() {
            // let height = this.getHeight()
            // this.$refs.wrapper.style.height = height  + 'px'
            // this.refresh()
        }
    }

}
</script>
<style lang="less" scoped> 

</style>


