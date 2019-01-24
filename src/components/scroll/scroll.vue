<template>
    <div ref="scrollInner">
        <slot></slot>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
    props: {
        data: {
            type: Array,
            default: null
        },
        click: {
            type: Boolean,
            default: true
        },
        listenScroll: {
            type: Boolean,
            default: false
        },
        probeType: {
            type: Number,
            default: 1
        },
        pullupload: {
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
            if (!this.$refs.scrollInner) return

            this.scroll = new BScroll(this.$refs.scrollInner, {
                click: this.click,
                probeType: this.probeType
            })
            if (this.listenScroll) {
                this.scroll.on('scroll', pos => {
                    this.$emit('scrolling', pos)
                })
            }
            if (this.pullupload) {
                this.scroll.on('scrollEnd', () =>{
                    if (this.scroll.y < this.scroll.maxScrollY + 50)
                        this.$emit('scrollToEnd')
                })
            }
            if (this.beforeScroll) {
                this.scroll.on('beforeScrollStart',() => {
                    this.$emit('beforescroll')
                })
            }
        },
        refresh () {
            this.scroll && this.scroll.refresh()
        },
        scrollToElement () {
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        },
        scrollTo () {
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        enable () {
            this.scroll && this.scroll.enable()
        },
        disable () {
            this.scroll && this.scroll.disable()
        },
    },
    watch: {
        data () {
            this.refresh()
        }
    }
}
</script>