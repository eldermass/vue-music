<template>
    <div class="progress-circle" @click.stop="clickHandler">
        <svg height='27' width='27' viewBox='0 0 50 50' xmlns="http://www.w3.org/2000/svg" version="1.1">
            <circle class="circle-all" cx="25" cy="25" r="24" stroke='#d7f3fc' stroke-width="2" fill="transparent" />
            <circle class="circle-pro" cx="25" cy="25" r="24" stroke='steelblue' stroke-width="2" fill="transparent" 
            :stroke-dasharray='dasharray' :stroke-dashoffset='dashoffset'/>
        </svg>
        <slot></slot>
    </div>
</template>
<script>
export default {
    props: {
        percent: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            dasharray: Math.PI * 50
        }
    },
    methods: {
        clickHandler() {
            this.$emit('svgclicked')
        }
    },
    computed: {
        dashoffset() {
            return (1 - this.percent) * this.dasharray
        }
    }
}
</script>
<style lang="less" scoped>
.progress-circle{
    position: relative;
    svg{
        position: absolute;
        z-index: 10000;
    }
}
</style>


