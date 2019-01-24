<template>
    <div>
        <div class="slider" ref="slider">
            <div class="slider-groups" ref="sliderGroup">
                <slot></slot>
            </div>
        </div>
        <div class="dots">
            <span :class="['dot',{'dot-active': currentIndex === index}]" v-for="(dot, index) in dots" :key="index"></span>
        </div>
    </div>
</template>
<script>
import BScroll from 'better-scroll' 
export default {
    data(){
        return {
            dots: [],
            currentIndex: 0,
            timer: null
        }
    },
    props:{
        loop: {
            type: Boolean,
            default: true
        },
        autoplay: {
            type: Boolean,
            default: true
        },
        interval: {
            type: Number,
            default: 4000
        }
    },
    mounted () {
        this.setSliderWidth()
        this.initDots()
        this.initSlider()

        if(this.autoplay){
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.play()
            }, this.interval)
        }
        window.addEventListener('resize', () => {
            this.setSliderWidth(true)
            this.slider.refresh()
        })
    },
    methods: {
        setSliderWidth(isResize){
            // 总的宽度
            let width = 0 
            let sliderWidth = this.$refs.slider.clientWidth
            this.children = this.$refs.sliderGroup.children

            for(let i = 0; i < this.children.length; i++){
                let child = this.children[i]
                child.style.width = sliderWidth + 'px'
                child.classList.add('slider-item')
                width += sliderWidth
            }
            if(this.loop && !isResize) {
                width += 2*sliderWidth
            }
            this.$refs.sliderGroup.style.width = width + 'px'
        },
        initDots(){
            this.dots = new Array(this.children.length)
        },
        initSlider(){
            this.slider = new BScroll(this.$refs.slider, {
                scrollX: true,
                scrollY: false,
                momentum: false,
                snap: {
                    loop: this.loop,
                    threshold: 0.3,
                    speed: 400
                },
                click: true
            })
            this.slider.on('scrollEnd', () => {
                let pageIndex = this.slider.getCurrentPage()
                this.currentIndex = pageIndex.pageX

                if(this.autoplay){
                    clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.play()
                    }, this.interval)
                }
            })
        },
        play(){
            this.currentIndex = this.currentIndex < this.children.length - 3 ? this.currentIndex + 1 : 0 
            this.slider.goToPage(this.currentIndex, 0, 400)
        },
        destroyed() {
            clearTimeout(this.timer)            
        },
    }
}
</script>
<style lang="less" scoped>
@import '../common/less/variable.less';
.slider{
    overflow: hidden;
    .slider-groups{
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

