<template>
    <div class="player" v-show='playList.length > 0'>
        <transition name='normal-player'
                @enter='enter' @after-enter='afterEnter'
                @leave='leave' @after-leave='afterLeave'>
        <div class="normal-player" v-show="fullScreen">
            <div class="background">
                <img :src="currentSong.image" width="100%" height="100%">
            </div>
            <div class="top">
                <span class="iconfont icon-down-trangle" @click="pickUpPlayer"></span>
                <h3 class="title">{{currentSong.name}}</h3>
                <p class="subtitle">{{currentSong.singer | singer}}</p>
            </div>
            <div class="middle"  
                @touchstart="midStartTouch"
                @touchmove='midTouchMove'
                @touchend='midEndTouch'
                >
                <div class="middle-left"  ref="midLeft">
                    <div class="cd-wrapper" ref="cdWrapper">
                        <div :class="['cd', rotateState]">
                            <img :src="currentSong.image">
                        </div>
                    </div>
                    <div class="mini-lyric-wrapper">
                        <p class="lyric-txt">{{currentLyric.lines | miniLyric(currentLrcLine)}}</p>
                    </div>
                </div>
                <div class="middle-right"  ref="midRight">
                    <div class="lyric-wrapper">
                        <Scroll ref="lyricScroll" :data='currentLyric && currentLyric.lines' :otherHeight='134'>
                        <div class="current-lyric" >
                            <p :class="['lyric-line', {'active-lrc': currentLrcLine === index}]"
                             v-for="(line, index) in currentLyric.lines"  :key="line.time" ref="lyricEles">
                                {{line.txt}}
                            </p>
                        </div>
                        </Scroll>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="dot-wrapper">
                    <div :class="['dot', {'dot-active': !lycPageShow}]"></div>
                    <div :class="['dot', {'dot-active': lycPageShow}]"></div>
                </div>
                <div class="progress-wrapper">
                    <span class="time">{{currentTime | toDuration}}</span>
                    <div class="progress-content">
                        <Progressbar :percent='curPercent' @changepercent='changeProgress'></Progressbar>
                    </div>
                    <span class="time">{{currentSong.duration | toDuration}}</span>
                </div>
                <div class="operators">
                    <div :class="{'higher': mode === 1}" @click="changeMode">
                        <span :class="['iconfont', modeIconStyle]"></span>
                    </div>
                    <div :class="['higher', isSongReady]" @click="prevSong">
                        <span class="iconfont icon-ttpodicon"></span>
                    </div>
                    <div :class="{'higher':playingState}">
                        <span :class="['iconfont',playIconStyle]" @click="toggleState"></span>
                    </div>
                    <div :class="['higher', isSongReady]" @click="nextSong">
                        <span class="iconfont icon-ttpodicon1"></span>
                    </div>
                    <div>
                        <span :class="['iconfont',getFavIcon(currentSong)]" @click="toggleFavState(currentSong)"></span>
                    </div>
                </div>
            </div>
        </div>
        </transition>
        <transition name='mini-player'>
        <div class="mini-player" v-show="!fullScreen" @click="unfoldPlayer">
            <div :class="['icon', rotateState]">
                <img :src="currentSong.image" ref="miniImg">
            </div>
            <div class="text">
                <h4 class="name">{{currentSong.name}}</h4>
                <p class="desc">{{currentSong.singer | singer}}</p>
            </div>
            <div class="controller">
                <ProgressCircle :percent='curPercent'>
                    <div :class="{'higher':playingState}">
                        <span :class="['iconfont iconplay', playIconStyle]" @click.stop="toggleState"></span>
                    </div>
                </ProgressCircle>
                <div class="sequence-list" @click.stop="showPlaylist">
                    <span class="iconfont icon-bofangliebiao"></span>
                </div>
            </div>
        </div>
        </transition>
        <audio :src="curSongUrl" ref="audio" @canplay="ready" @error="error"
        @timeupdate="timeUpdate" @ended="end"></audio>
        <Playlist ref="playlist"></Playlist>
    </div>    
</template>
<script>
import {disturb} from 'common/js/disturb'
import {playMode} from 'common/js/config'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import Progressbar from './progress'
import ProgressCircle from './progress-circle'
import Lyric from 'lyric-parser'
import Scroll from 'components/Scroll'
import Playlist from './playlist'
import {favoriteMix} from 'common/js/mixin'
export default {
    mixins: [favoriteMix],
    data() {
        return {
            songReady: false,
            currentTime: 0,
            currentLyric: {},
            currentLrcLine: 0,
            lycPageShow: false,
            touch: {},
            vkey: `0A7DEBD19F140C4E014A5802713DB9C9C7DD42E324D5198A975AF40325B114407633DEFB6C97DAD4FF229F015B3B833772C72C9BA9093618`
        }
    },
    methods:{
        showPlaylist() {
            this.$refs.playlist.show()
        },
        midStartTouch(e) {
            this.touch.initaited = true
            let touch = e.touches[0]
            this.touch.startX = touch.pageX
            this.touch.startY = touch.pageY
        },
        midTouchMove(e) {
            if(!this.touch.initaited) return 
            let touch = e.touches[0]
            let deltaX = touch.pageX - this.touch.startX
            let deltaY = touch.pageY - this.touch.startY

            if(Math.abs(deltaY) > Math.abs(deltaX)) return
            
            if(!this.lycPageShow && deltaX < 0){
                this.transPage(deltaX)
                this.touch.deltaX = deltaX
            }
            if(this.lycPageShow && deltaX > 0){
                this.transPage(deltaX - window.innerWidth)
                this.touch.deltaX = deltaX
            }
        },
        midEndTouch() {
            this.touch.initaited = false
            if(this.touch.deltaX < -window.innerWidth/3){
                this.lycPageShow = true
                this.transPage(-window.innerWidth, true)
            }else if(this.touch.deltaX < 0){
                 this.transPage(0, true)
            }
            if(this.touch.deltaX > window.innerWidth/3){
                this.lycPageShow = false
                this.transPage(0, true)
            }else if(this.touch.deltaX > 0){
                this.transPage(-window.innerWidth, true)
            }
        },
        transPage(x, trans){
            if(!trans){
                this.$refs.midLeft.style.transition = ``
                this.$refs.midRight.style.transition = ``
            }
            this.$refs.midLeft.style.transform = `translateX(${x}px)`
            this.$refs.midRight.style.transform = `translateX(${x}px)`
            if(trans){
                this.$refs.midLeft.style.transition = `all .5s`
                this.$refs.midRight.style.transition = `all .5s`
            }
        },
        async getIrc(){
            let res = await this.$get('/lyric', {mid: this.currentSong.mid})
            let reg = new RegExp(`ti:${this.currentSong.name}`)
            // 因为是异步数据，快速切歌会导致多次实例化歌词
            if(!reg.test(res.data)) {
                return
            }
            if(res.data)
                this.currentLyric = new Lyric(res.data, this.handlerLyric)
            else{
                this.currentLyric = null
                this.currentLrcLine = 0
            }
            
            if(this.playingState){
                this.currentLyric.play()
            }
        },
        handlerLyric({lineNum, txt}) {
            this.currentLrcLine = lineNum
            if( lineNum > 5){
                let lineEl = this.$refs.lyricEles[lineNum - 5]
                this.$refs.lyricScroll.scrollToElement(lineEl, 1000)
            }else{ 
                this.$refs.lyricScroll.scrollTo(0, 0, 1000)
            }
        },
        changeMode() {
            let mode = (this.mode + 1) % 3
            this.SET_PLAY_MODE(mode)
            let list = null
            if(mode === playMode.random) {
                list = disturb(this.sequenceList)
            } else {
                list = this.sequenceList
            }
            // 保证当前歌曲不变
            this.resetCurrentIndex(list)
            this.SET_PLAYLIST(list)
        },
        resetCurrentIndex(list) {
            let index = list.findIndex(item => {
                return item.id === this.currentSong.id
            })
            this.SET_CURRENTINDEX(index)
        },
        changeProgress(per) {
            let time = per * this.currentSong.duration
            this.$refs.audio.currentTime = time
            if(this.currentLyric.seek)
                this.currentLyric.seek(time * 1000)
            if(!this.playingState)
                this.toggleState()
        },
        loop() {
            this.$refs.audio.currentTime = 0
            this.$refs.audio.play()
            if(this.currentLyric.seek)
                this.currentLyric.seek(0)
        },
        end() {
            if(this.mode === playMode.loop){
                this.loop()
            }else{
                this.nextSong()
            }
        },
        error() {
            this.songReady = true
        },
        ready() {
            this.songReady = true
            this.savePlayHistory(this.currentSong)
        },
        timeUpdate(e) {
            this.currentTime = e.target.currentTime
        },
        nextSong() {
            if(!this.songReady) return
            if(this.playList.length === 1){
                this.loop()
            } else {
                let index = this.currentIndex + 1
                index === this.playList.length && (index = 0)
                this.SET_CURRENTINDEX(index)
                if(!this.playingState)
                    this.toggleState()
                this.songReady = false
            }
        },
        prevSong() {
            if(!this.songReady) return
            if(this.playList.length === 1){
                this.loop()
            } else {
                let index = this.currentIndex - 1
                index === -1 && (index = this.playList.length - 1)
                this.SET_CURRENTINDEX(index)
                if(!this.playingState)
                    this.toggleState()
                this.songReady = false            
            }
        },
        toggleState() {
            if(!this.songReady) return
            this.SET_PLAYING_STATE(!this.playingState)        
            if(this.currentLyric.togglePlay)
                this.currentLyric.togglePlay()   
        },
        enter(el, done){
            if(!this.flag){
                this.position = this.getPosAndScale()
                this.flag = true
                this.$refs.cdWrapper.style.transition = 'all 0.5s'
                this.$refs.cdWrapper.style.opacity = '0'
            }
            this.$refs.cdWrapper.getBoundingClientRect()// 仅仅为了一次dom渲染
            this.$refs.cdWrapper.style.transform = 'translate3d(0,0, 0) scale(.1)'
            el.addEventListener('transitionend', done)
        },
        afterEnter(){
            this.$refs.cdWrapper.style.transform = 'translate3d(0,0, 0) scale(1)'
            this.$refs.cdWrapper.style.opacity = '1'
        },
        leave(el, done) {
            let {x, y, scale} = {x:0, y:0, scale:0}
            if(this.position){
                let {x, y, scale} = this.position
            }
            this.$refs.cdWrapper.style.transform = `translate3d(${x}px,${y}px, 0) scale(${scale})`
            el.addEventListener('transitionend', done)
        },
        afterLeave() {
            
        },
        getPosAndScale(){
            const posmini = this.$refs.miniImg.getBoundingClientRect()
            const poscd = this.$refs.cdWrapper.getBoundingClientRect()
            const scale = posmini.width / poscd.width
            const x = (posmini.left + posmini.right)/2 - (poscd.left + poscd.right)/2
            const y = (posmini.top + posmini.bottom)/2 - (poscd.top + poscd.bottom)/2
            return {
                x, y, scale
            }
        },
        pickUpPlayer() {
            this.SET_FULLSCREEN(false)
        },
        unfoldPlayer() {
            this.SET_FULLSCREEN(true)
        },
        ...mapMutations(['SET_FULLSCREEN', 'SET_PLAYING_STATE', 'SET_CURRENTINDEX', 'SET_PLAY_MODE', 'SET_PLAYLIST']),
        ...mapActions(['savePlayHistory'])
    },
    computed: {
        ...mapGetters(['playList', 'fullScreen', 'currentSong', 'playingState', 'currentIndex', 'mode', 'sequenceList']),
        modeIconStyle() {
            let icon = ''
            switch(this.mode){
                case playMode.sequence:
                    icon = 'icon-ttpodicon2';
                    break;
                case playMode.loop:
                    icon = 'icon-danquxunhuan';
                    break;
                case playMode.random:
                    icon = 'icon-icon-test';
                    break;
            }
            return icon
        },
        playIconStyle() {
            return this.playingState ? 'icon-zanting1' : 'icon-zanting'
        },
        rotateState() {
            return this.playingState ? 'playing': 'playing pause'
        },
        isSongReady() {
            return this.songReady ? '' : 'disable'
        },
        curPercent() {
            return this.currentTime / this.currentSong.duration
        },
        curSongUrl() {
            if(!this.currentSong.url) return
            return this.currentSong.url.replace(/vkey=([^&]+)&/,($1,$2) => {
                return `vkey=${this.vkey}&`
            })
        }
    },
    filters: {
        singer(vals) {
            if(!vals)return
            let str = ''
            vals.forEach((singer, index) => {
                if(index === 0){
                    str = singer.name
                }else{
                    str += `/${singer.name}`
                }
            })
            return str
        },
        toDuration(interval) {
            let min = parseInt(interval/60)
            let sec = parseInt(interval%60)
            return `${min}:${parseInt(sec/10)}${parseInt(sec%10)}`
        },
        miniLyric(lines, index) {
            if(lines){
                if(lines.length)
                    return lines[index] && lines[index].txt
                else
                    return '此歌曲为没有填词的纯音乐，请您欣赏'
            }
        }
    },
    watch: {
        currentSong(newSong, oldSong) {
            if(newSong.id === oldSong.id) 
                return
            if(this.currentLyric.stop)
                this.currentLyric.stop()
            // nextTick 可以换成 setTimeout 加长页面切换的中的播放问题
            this.$nextTick(() => {
                this.$refs.audio.play()
                this.getIrc()
            })
        },
        playingState(newState) {
            this.$nextTick(() => {
                let {audio} = this.$refs
                newState ? audio.play() : audio.pause()
            })
        }
    },
    components: {
        Progressbar, ProgressCircle, Scroll, Playlist
    }
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable.less';
.player{
    .normal-player{
        color:darken(@color-background, 10%);
        background: lighten(@color-background, 24%);
        position: fixed;top: 0;left: 0;right: 0;bottom: 0;
        height: 100%;width: 100%;z-index: 10000;
        .background{
            height: 100%;filter: blur(15px);
        }
        .top{
            padding: .2rem 0;
            color: darken(@color-background, 20%);
            width: 100%;.flex;
            position: absolute;top: 0;
            flex-direction: column;
            .icon-down-trangle{
                position: absolute;
                font-size: 30px;
                left: .5rem;top:.2rem;
            }
            .subtitle{
                font-size: @small-font;margin-top: .5rem;
            }
        }
        .middle{
            position: absolute; height: 65%;
            width: 100%;box-sizing: border-box;
            top: 4rem;
            .middle-left{
                position: absolute;top: 0;width: 100%;left:0;
                padding:3rem 3rem 0 3rem;
                .cd-wrapper{
                    overflow: hidden;
                    border-radius: 50%;
                    .cd{
                        border-radius: 50%;
                        border: 4px solid rgba(255,255,255,.5);
                        img{
                            border-radius: 50%;
                            height: 100%;width: 100%;
                        }
                    }
                    .playing{
                        animation: rotate 20s linear infinite;
                    }
                    .pause{
                        animation-play-state: paused
                    }
                }
                .mini-lyric-wrapper{
                    margin-top: 4rem;
                    .lyric-txt{
                        text-align: center
                    }
                }
            }
            .middle-right{
                position: absolute;top: 0;left: 100%;width: 100%; height: 100%;
                .lyric-wrapper{
                    padding: .5rem 0;
                    text-align: center;overflow: hidden;height: 100%;
                    .current-lyric{
                        .lyric-line{
                            padding: .3rem;
                        }
                        .active-lrc{
                            color: orange;
                        }
                    }
                }
            }
        }
        .bottom{
            position: absolute;
            bottom: 2rem;width: 100%;padding:0 1.5rem;
            .dot-wrapper{
                .flex;padding-bottom: 1.5rem;
                .dot{
                    height: 8px;width: 8px;margin: 0 3px;box-shadow: 0 0 2px #888;
                    border-radius: 4px;background-color: rgba(255,255,255,.5);
                }
                .dot-active{
                    width: 16px;background-color:white;
                }
            }
            .progress-wrapper{
                .flex;
                .progress-content{
                    flex-grow: 1;
                }
                .time{
                    padding: .1rem .6rem;
                }
            }
            .operators{
                height: 4rem;
                .flex;justify-content:space-around;
                span{
                    font-size: 35px;
                }
                .higher{
                    transform: translateY(-3px);
                }
                .disable{
                    &:hover{
                        color: grey;
                    }
                }
                .xihuan{
                    color: pink
                }
            }
        }
    }
    .mini-player{
        background: lighten(@color-background, 24%);height: 3rem;width: 100%;z-index: 10000;
        position: absolute;bottom: 3rem;.flex;padding-left:1rem;border-top:1px solid @color-background;
        color:darken(@color-background, 10%);
        .icon{
            height: 3rem;width:3rem;
            padding: .3rem;
            img{
                border-radius: 50%;
                height: 100%;width: 100%;
            }
        }
        .playing{
            animation: rotate 10s linear infinite;
        }
        .pause{
            animation-play-state: paused
        }
        .text{
            padding-left: .5rem;
            flex-grow:1;
            .name{
                width: 150px;
                .wrap;
            }
            .desc{
                font-size: @small-font;color:#888;
            }
        }
        .controller{
            .flex;
            .iconfont{
                padding: 0 .5rem;
                font-size: 27px;
            }
            .iconplay{
                padding-left: 0; 
            }
            .higher{
                transform: translateY(-2.3px);
            }
        }
    }
}
@keyframes rotate {
    0%{
        transform: rotate(0)
    }
    100%{
        transform: rotate(360deg)
    }
}
.normal-player-enter-active,.normal-player-leave-active{
    transition: all .5s;
    .top,.bottom{
        transition: all .5s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    }
}
.normal-player-enter,.normal-player-leave-to{
    opacity: 0;
    .top{
        transform: translateY(-100px);
    }
    .bottom{
        transform: translateY(100px);
    }
}
.mini-player-enter-active{
    transition: all .3s .1s;
}
.mini-player-enter,.mini-player-leave-to{
    opacity: 0;
}
</style>


