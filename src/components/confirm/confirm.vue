<template>
    <transition name='confirm-fade'>
        <div class="confirm" v-show="showConfirm" @click.stop>
            <div class="confirm-wrapper">
                <div class="confirm-content">
                    <p class="text">{{text}}</p>
                    <div class="operator">
                        <div class="btn left" @click="confirm">{{confirmText}}</div>
                        <div class="btn" @click="cancel">{{cancelText}}</div>
                    </div>
                </div>
            </div>
        </div>    
    </transition>
</template>
<script>
export default {
    props: {
        text: {
            type: String,
            default: '是否要清空历史'
        },
        confirmText: {
            type: String,
            default: '清空'
        },
        cancelText: {
            type: String,
            default: '取消'
        }
    },
    data () {
        return {
            showConfirm: false
        }
    },
    methods: {
        show() {
            this.showConfirm = true
        },
        hide() {
            this.showConfirm = false
        },
        confirm() {
            this.hide()
            this.$emit('confirm')
        },
        cancel() {
            this.hide()
            this.$emit('cancel')
        }
    },
}
</script>
<style lang="less" scoped>
.confirm{
    position: fixed; top: 0;bottom: 0;left: 0;right: 0;
    background: rgba(0, 0, 0,.2);z-index: 999;
    .confirm-wrapper{
        position: absolute;top: 50%;left: 50%; transform: translate(-50%, -50%);
        .confirm-content{
            overflow: hidden;
            width: 250px;background: #fff;border-radius: 10px;
            border: 1px solid lighten(skyblue, 15%);
            .text{
                text-align: center;padding: 1rem;
            }
            .operator{
                display: flex; align-items: center; justify-content: space-around;
                .btn{
                    padding: 6px;
                    text-align: center;
                    flex-grow: 1;
                    color: steelblue;
                    border-top:1px solid skyblue;
                }
                .left{
                    color: steelblue;
                    border-right: 1px solid skyblue;
                }
            }
        }
    }
}
.confirm-fade-enter-active{
    animation: confirm-in .3s;
    .confirm-content{
        animation: content-in .3s;
    }
}
@keyframes confirm-in {
    from{
        opacity: 0;
    }
    to{
        opacity: 1;
    }
}
@keyframes content-in {
    0%{
        transform: scale(0)
    }
    60%{
        transform: scale(1.2)
    }
    100%{
        transform: scale(1)
    }
}
</style>

