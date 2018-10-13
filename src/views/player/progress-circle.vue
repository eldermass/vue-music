<template>
    <div class="progress-circle">
        <svg height='27' width='27' viewBox='0 0 54 54' xmlns="http://www.w3.org/2000/svg" version="1.1">
            <circle class="circle-all" cx="27" cy="27" r="25" stroke='' stroke-width="2" fill="transparent" />
            <circle class="circle-pro" cx="27" cy="27" r="25" stroke='steelblue' stroke-width="3" fill="transparent" 
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
        z-index: -1;
    }
}
</style>


