<template>
    <div class="slider">
        <div class="slider-wrapper" ref="sliderWrapper">
            <div class="img-wrapper" ref="imgWrapper">
                <slot></slot>
            </div>
        </div>
        <div class="dots">
            <span :class="['dot', {'dot-active': currentIndex === index}]"
            v-for="(dot, index) in dots" :key="index">
            </span>
        </div>
    </div>
</template>
<script>
import BScroll from 'better-scroll';
export default {
    props: {
        loop: {
            type: Boolean,
            default: true
        },
        interval: {
            type: Number,
            default: 4000
        }
    },
    data () {
        return {
            dots: [],
            currentIndex: 0,
            timer: null
        }
    },
    mounted() {
        this.initWidth()
        this.initDots()
        this.initSlider()
        this.handleAutoplay()
        window.addEventListener('resize', () => {
            this.initWidth(true)
            this.slider.refresh()
        })
    },
    methods: {
        initWidth (isResize) {
            // 记录总的宽度
            let width = 0
            // 记录slider 的宽度
            let sliderWidth = this.$refs.sliderWrapper.clientWidth
            // 记录每个item的数组
            this.children = this.$refs.imgWrapper.children
            for (let i = 0; i < this.children.length; i++) {
                let child = this.children[i]
                child.style.width = sliderWidth + 'px'
                child.classList.add('slider-item')
                width += sliderWidth
            }
            // this.loop 初始化后slider会多两个子元素，所以在第二次设置时children已经多了两个
            if (this.loop && !isResize) {
                width += 2 * sliderWidth
            }
            this.$refs.imgWrapper.style.width = width + 'px'
        },
        initDots () {
            this.dots = new Array(this.children.length)
        },
        initSlider () {
            this.slider = new BScroll(this.$refs.sliderWrapper, {
                click: true,
                scrollX: true,
                scrollY: false,
                momentum: false,
                snap: {
                    loop: this.loop,
                    threshold: 0.3,
                    speed: 400
                },
            })
            this.slider.on('scrollEnd', () => {
                let pageindex = this.slider.getCurrentPage()
                this.currentIndex = pageindex.pageX
                this.handleAutoplay()
            })
        },
        handleAutoplay () {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.currentIndex = this.currentIndex < this.children.length - 3 ? this.currentIndex + 1 : 0 
                this.slider.goToPage(this.currentIndex, 0, 400)
            }, this.interval)
        },
        destroyed() {
            clearTimeout(this.timer)
        },
    },
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable.less';
.slider-wrapper{
    overflow: hidden;
    .img-wrapper{
        .slider-item{
            float: left;
            a{
                img{
                    width: 100%;
                }
            }
        }
        &:after{
            display: block;
            content: '';
            clear: both;
        }
    }
}
.dots{
    .flex;
    border: 1x solid;
    margin-top: -21px;
    width: 100%;
    .dot{
        position: relative;
        display: inline-block;
        width: 8px;height: 8px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        margin:0 4px;
    }
    .dot-active{
        background: rgba(255, 255, 255, 0.9);
        width: 20px;
        border-radius: 4px;
    }
}
</style>
