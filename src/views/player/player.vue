<template>
    <div class="player" v-show='playList.length > 0'>
        <transition name='normal-player'
                @enter='enter' @after-enter='afterEnter'
                @before-leave='beforeLeave' @leave='leave'>
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img :src="currentSong.image" width="100%" height="100%">
                </div>
                <div class="top">
                    <span class="iconfont icon-down-trangle" @click="pickUpPlayer"></span>
                    <div class="title-wrapper">
                        <h3 class="title">{{currentSong.name}}</h3>
                    </div>
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
                        <Scroll class="lyric-wrapper" ref="lyricScroll" :data='currentLyric && currentLyric.lines'>
                            <div class="current-lyric" >
                                <p :class="['lyric-line', {'active-lrc': currentLrcLine === index}]"
                                v-for="(line, index) in currentLyric.lines"  :key="line.time" ref="lyricEles">
                                    {{line.txt}}
                                </p>
                            </div>
                        </Scroll>
                    </div>
                </div>
                <div class="bottom">
                    <div class="vocie-wrapper">
                        <Volume @volume='changeVolume'></Volume>
                    </div>
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
                        <div @click="changeMode">
                            <span :class="['iconfont', modeIconStyle]"></span>
                        </div>
                        <div :class="isSongReadyClass" @click="prevSong">
                            <span class="iconfont icon-kuaitui"></span>
                        </div>
                        <div>
                            <span :class="['iconfont', playIconStyle, isSongReadyClass]" @click="toggleState"></span>
                        </div>
                        <div :class="isSongReadyClass" @click="nextSong">
                            <span class="iconfont icon-kuaijin"></span>
                        </div>
                        <div>
                            <span :class="['iconfont', getFavIcon(currentSong)]" @click="toggleFavState(currentSong)"></span>
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
                    <ProgressCircle :percent='curPercent' @svgclicked='toggleState'>
                        <span :class="['iconfont iconplay', playIconStyle]" @click.stop="toggleState"></span>
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
import Scroll from '_c/scroll'
import ProgressCircle from './progress-circle'
import Progressbar from './progress'
import Volume from './volume'
import Playlist from './playlist'
import Lyric from 'lyric-parser'
import { getLyric } from '@/api/song'
import { favoriteMix } from '@/mixin'
import { mapGetters, mapMutations, mapActions } from 'vuex'

import { disturb } from 'common/js/disturb'
import { playMode } from 'common/js/config'
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
            volumnIcon: 'icon-shengyinyinliangmianxing',
            firstInPlayer: true
        }
    },
    methods:{
        changeVolume (vol) {
            if(this.$refs.audio) {
                vol = Math.max(0, Math.min(100, vol / 100))
                this.$refs.audio.volume = vol
            }
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
            if(this.touch.deltaX < -window.innerWidth / 3){
                this.lycPageShow = true
                this.transPage(-window.innerWidth, true)
            }else if(this.touch.deltaX < 0){
                 this.transPage(0, true)
            }
            if(this.touch.deltaX > window.innerWidth / 3){
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
        async getLrc(){
            let data = await getLyric(this.currentSong.mid)
            let songName = this.currentSong.name.replace(/\(.+\)/g, '')
            let reg = new RegExp(`ti:${songName}`)
            // 因为是异步数据，快速切歌会导致多次实例化歌词, 歌词与歌名相同才能通过
            if (!reg.test(data)) {
                // 处理一下没有歌词的情况
                this.currentLyric = {
                    lines: [{
                        time: 0,
                        txt: '此歌曲为没有填词的纯音乐，请您欣赏'
                        }]
                }
                this.currentLrcLine = 0
                return 
            }
            if (data)
                this.currentLyric = new Lyric(data, this.handlerLyric)
                
            if (this.playingState) 
                this.currentLyric.play()
        },
        handlerLyric ({ lineNum, txt }) {
            this.currentLrcLine = lineNum
            if( lineNum > 5){
                let lineEl = this.$refs.lyricEles[lineNum - 5]
                this.$refs.lyricScroll && this.$refs.lyricScroll.scrollToElement(lineEl, 1000)
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
            if (this.currentLyric.seek)
                this.currentLyric.seek(time * 1000)
            if (!this.playingState)
                this.toggleState()
        },
        nextSong() {
            if(!this.songReady) return
            if(this.playList.length === 1){
                this.loop()
            } else {
                let index = this.currentIndex + 1
                index === this.playList.length && (index = 0)
                this.SET_CURRENTINDEX(index)
                if (!this.playingState)
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
            // console.log(this.songReady)
            if (!this.songReady) {
                // 手机浏览器，点击还没有准备的时候 就重新加载
                this.$refs.audio.load()
                if (this.currentLyric.seek) {
                    this.currentLyric.seek(0)
                    this.currentLyric.togglePlay()
                }   
                return
            }
            this.SET_PLAYING_STATE(!this.playingState)        
            if (this.currentLyric.togglePlay)
                this.currentLyric.togglePlay()
        },
        end() {
            if(this.mode === playMode.loop){
                this.loop()
            }else{
                this.nextSong()
            }
        },
        error() {
            // this.songReady = true
        },
        ready() {
            // console.log('can play')
            // console.log('paused -- ' + this.$refs.audio.paused)
            if (this.firstInPlayer) {
                this.SET_PLAYING_STATE(true)
                this.firstInPlayer = false
                if (this.currentLyric.togglePlay)
                    this.currentLyric.togglePlay()
            }
            this.songReady = true
            this.savePlayHistory(this.currentSong)
        },
        loop() {
            this.$refs.audio.currentTime = 0
            this.$refs.audio.play()
            if (this.currentLyric.seek)
                this.currentLyric.seek(0)
        },
        timeUpdate(e) {
            this.currentTime = e.target.currentTime
        },
        pickUpPlayer() {
            this.SET_FULLSCREEN(false)
        },
        unfoldPlayer() {
            this.SET_FULLSCREEN(true)
        },
        enter(el, done){
            el.addEventListener('transitionend', done)
            if(!this.flag){
                // 第一次进入
                this.position = this.getPosAndScale()
                this.flag = true
                this.$refs.cdWrapper.style.transform = 'translate3d(0,0, 0) scale(0.2)'
                this.$refs.cdWrapper.style.opacity = '0'
                return
            }    
            this.$refs.cdWrapper.style.transform = `translate3d(${this.position.offsetX}px, ${this.position.offsetY}px, 0) scale(${this.position.scale})`
        },
        afterEnter (){
            this.$refs.cdWrapper.style.transition = 'all .5s'
            this.$refs.cdWrapper.style.transform = 'translate3d(0,0, 0) scale(1)'
            this.$refs.cdWrapper.style.opacity = '1'
        },
        beforeLeave () {
            this.$refs.cdWrapper.style.transform = 'translate3d(0,0, 0) scale(1)'
        },
        leave (el, done) {
            el.addEventListener('transitionend', done)
            
            let { offsetX, offsetY, scale } = this.position
            if (!offsetX || !offsetY || !scale) return

            this.$refs.cdWrapper.style.transform = `translate3d(${this.position.offsetX}px, ${this.position.offsetY}px, 0) scale(${this.position.scale})`
        },
        getPosAndScale(){
            const posmini = this.$refs.miniImg.getBoundingClientRect()
            const poscd = this.$refs.cdWrapper.getBoundingClientRect()
            const scale = posmini.width / poscd.width
            const offsetX = (posmini.left + posmini.right)/2 - (poscd.left + poscd.right)/2
            const offsetY = (posmini.top + posmini.bottom)/2 - (poscd.top + poscd.bottom)/2
            return {
                offsetX, offsetY, scale
            }
        },
        showPlaylist() {
            this.$refs.playlist.show()
        },
        ...mapMutations(['SET_FULLSCREEN', 'SET_PLAYING_STATE', 'SET_CURRENTINDEX', 'SET_PLAY_MODE', 'SET_PLAYLIST']),
        ...mapActions(['savePlayHistory'])
    },
    computed: {
        ...mapGetters(['playList', 'fullScreen', 'currentSong', 'playingState', 'currentIndex', 'mode', 'sequenceList', 'vkey']),
        modeIconStyle() {
            let icon = ''
            switch(this.mode){
                case playMode.sequence:
                    icon = 'icon-liebiaoxunhuan';
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
            return this.playingState ? 'icon-bofang' : 'icon-zanting'
        },
        rotateState() {
            return this.playingState ? 'playing': 'playing pause'
        },
        isSongReadyClass() {
            return this.songReady ? '' : 'disable'
        },
        curPercent() {
            return this.currentTime / this.currentSong.duration
        },
        curSongUrl() {
            if(!this.currentSong.url) return

            return this.currentSong.url.replace(/vkey=([^&]+)&/, ($1, $2) => {
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
        currentSong (newSong, oldSong) {
            if(newSong.id === oldSong.id || !newSong.id)
                return
            if(this.currentLyric.stop)
                this.currentLyric.stop()
            // 第一次进入，设置为非播放状态
            if (this.firstInPlayer) {
                this.SET_PLAYING_STATE(false)
                this.getLrc()
                return
            }
            // nextTick 可以换成 setTimeout 加长页面切换的中的播放问题
            this.$nextTick(() => {
                this.$refs.audio.play()
                this.getLrc()
            })
        },
        playingState (newState) {
            this.$nextTick(() => {
                let { audio } = this.$refs
                newState ? audio.play() : audio.pause()
            })
        }
    },
    components: {
        Progressbar, ProgressCircle, Scroll, Playlist, Volume
    }
}
</script>
<style lang="less" scoped>
@import '../../common/less/variable.less';
.player{
    .normal-player{
        height: 100%;width: 100%;
        color:darken(@color-background, 10%);
        background: lighten(@color-background, 24%);
        position: fixed; top: 0; bottom: 0; width: 100%; z-index: 10000;
        .background{
            height: 100%;filter: blur(15px);
        }
        .top {
            height: 3.5rem;
            width: 100%;
            color: darken(@color-background, 20%);
            .flex;
            flex-direction: column;
            position: absolute;top: 0;
            .icon-down-trangle {
                position: absolute;
                font-size: 30px;
                left: .5rem;top:.2rem;
            }
            .title-wrapper {
                width: 75%;
                overflow: hidden;
                white-space: nowrap;
                .title {
                    text-align: center;
                }
            }
            .subtitle {
                font-size: @small-font;
                margin-top: .5rem;
            }
        }
        .middle{
            height: 65%;
            width: 100%;
            position: absolute; 
            box-sizing: border-box;
            top: 3.5rem;
            .middle-left{
                position: absolute;
                top: 0; bottom: 0;
                width: 100%;
                .flex;
                flex-direction: column;
                justify-content: space-around;
                .cd-wrapper{
                    overflow: hidden;
                    height: 270px;
                    width: 270px;
                    .cd{
                        height: 100%;width: 100%;
                        border-radius: 50%;
                        border: 4px solid rgba(255,255,255,.5);
                        .flex;
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
                    .lyric-txt{
                        text-align: center
                    }
                }
            }
            .middle-right{
                position: absolute;top: 0;left: 100%;width: 100%; height: 100%;
                .lyric-wrapper{
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
            bottom: 0;width: 100%; padding: 0 1.5rem 1rem 1.5rem;
            .vocie-wrapper{
                position: absolute;
                right: 3rem;
                bottom: 8rem;
            }
            .dot-wrapper{
                .flex;
                padding-bottom: 1.5rem;
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
                .disable{
                    color: grey;
                }
                .xihuan{
                    color: pink
                }
            }
        }
    }
    .mini-player{
        height: 3rem;width: 100%;
        position: absolute;
        bottom: 3rem;
        padding-left:1rem;
        border-top:1px solid @color-background;
        z-index: 10000;
        .flex;
        background: lighten(@color-background, 24%);
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
                width: 170px;
                .wrap;
            }
            .desc{
                font-size: @small-font;color:#888;
                width: 150px;
                .wrap;
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


