<template>
  <div class="mainpart">
    <!-- 操作盒子 -->
    <div class='operationBox'>
      <!-- 播放/暂停 -->
      <div
        @click='playBtn'
        class="playButtCon"
        id="playButtCon">
        {{ playButtConText }}
      </div>
      <!-- 音频轨迹 -->
      <div
        @mousedown='trackDown'
        @mousemove='trackMove'
        @mouseup='trackUp'
        class="audioTrack"
        ref="audioTrack">
        <!-- 进度百分比 -->
        <div
          class="audioPercentage"
          ref='audioPercentage'
          :style="{ width: accomplishData + unit}">
        </div>
        <div class='audioName'>Audio {{ title }}</div>
      </div>
      <!-- reset / time -->
      <div
        @click='retPlay'
        @mouseover='hoverFn'
        @mouseout='outFn'
        class="timerR">
        <img
          v-if='showRet'
          src='../assets/reset.png'>
        <span v-if='!showRet'>{{ countTime ? countTime : altogetherTimer }}s</span>
      </div>
    </div>
    <!-- 原生音频文件 -->
    <div class="originalAudio">
      <audio
        ref='audioEl'
        autobuffer
        controls="controls"
        id="myAudio"
        @canplaythrough="oncanplaythrough">
        <source
          :src="source"
          type="audio/mpeg">
      </audio>
    </div>
  </div>
</template>

<script>
let timer
export default {
  name: 'audio-vue',
  props: {
    source: {
      type: String,
      default: 'http://music.163.com/song/media/outer/url?id=431795489.mp3'
    },
    title: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      playButtConText: '▶',
      altogetherTimer: null, //音频总时长
      scheduleTimer: 0, //当前播放进度时间
      accomplishData: null, // 当前播放进度比
      countTime: null, // 倒计时时间
      unit: '%', //单位
      showRet: false,
      isTransition: true,
      ismouseDown: false,
      lastMoveVal: 0,
    }
  },
  methods: {
    // oncanplaythrough 事件在视频/音频（audio/video）可以正常播放且无需停顿和缓冲时触发
    oncanplaythrough () {
      this.altogetherTimer = Math.round(this.$refs.audioEl.duration) === Infinity ? 0 : Math.round(this.$refs.audioEl.duration)
    },
    hoverFn () {
      this.showRet = true
    },
    outFn () {
      this.showRet = false
    },
    // 正在播放时音频轨迹的状态
    myAudioPlay (PercentageData) {
      let audioEl = this.$refs.audioEl
      this.unit = '%'
      this.accomplishData = PercentageData * 100
      if (audioEl.currentTime == audioEl.duration) {
        this.playButtConText = '▶'
        clearInterval(timer)
      }
    },
    playBtn () {
      let audioEl = this.$refs.audioEl
      let percentEl = this.$refs.audioPercentage
      if (this.$refs.audioEl.paused) {
        if (audioEl.currentTime == audioEl.duration) {
          this.accomplishData = 0
        }
        audioEl.play()
        clearInterval(timer) // 清除计时器
        this.playButtConText = '■'
        timer = setInterval(() => {
          this.myAudioPlay(audioEl.currentTime / audioEl.duration) // 计算播放进度百分比
          this.countTime = this.altogetherTimer - Math.round(audioEl.currentTime)
        }, 1000)
      } else {
        audioEl.pause()
        clearInterval(timer) // 清除计时器
        this.playButtConText = '▶'
      }
    },
    retPlay () {
      let audioEl = this.$refs.audioEl
      audioEl.currentTime = 0
      this.accomplishData = 0
      this.countTime = null
      audioEl.pause()
      this.playBtn()
    },
    trackFn (ev) {
      let audioTrack = this.$refs.audioTrack // 音频轨迹
      let audioEl = this.$refs.audioEl
      let audioTrackW = audioTrack.offsetWidth // 读取音频轨迹的长度
      this.unit = 'px'
      this.accomplishData = ev.layerX
      let cilckPercentage = ev.layerX / audioTrackW
      audioEl.currentTime = cilckPercentage * audioEl.duration
      this.countTime = this.altogetherTimer - Math.round(audioEl.currentTime)
    },
    // 点击音频轨迹
    trackDown (ev) {
      this.ismouseDown = true
      this.unit = 'px'
      this.accomplishData = ev.layerX
    },
    trackMove (ev) {
      if (this.ismouseDown) {
        this.trackFn(ev)
      }
    },
    trackUp (ev) {
      this.ismouseDown = false
      this.trackFn(ev)
      if (this.$refs.audioEl.paused) {
        this.playBtn()
      }
    }
  },
  mounted () {

  }
}
</script>

<style lang="scss" scoped>
.mainpart{
  width: 100%;
  box-sizing: border-box;
  padding: 10px 0;
  .operationBox{
    width: 100%;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    box-shadow: 0 1px 2px rgba(0,0,0,.3);
    .playButtCon{
      width: 50px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: #fff;
      font-weight: 700;
      background-color: #F05C38;
    }
    .audioTrack{
      width: 100%;
      height: 100%;
      margin: 0 auto;
      position: relative;
      background-color: rgba(255, 255, 255, .75);
      .audioPercentage{
        height: 100%;
        position: absolute;
        top: 0;
        left: 0 ;
        background-color: #F05C38;
        opacity: .85;
        transition: all .05s;
      }
      .audioName{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: #333;
        position: absolute;
        -moz-user-select: none; /* Firefox私有属性 */
        -webkit-user-select: none; /* WebKit内核私有属性 */
        -ms-user-select: none; /* IE私有属性(IE10及以后) */
        -khtml-user-select: none; /* KHTML内核私有属性 */
        -o-user-select: none; /* Opera私有属性 */
        user-select: none; /* CSS3属性 */
      }
    }
    .timerR{
      width: 50px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #F05C38;
      span{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
      img{
        width: 18px;
      }
    }
  }
}
.originalAudio{
  width: 0;
  height: 0;
  audio{
    width: 0;
    height: 0;
  }
}
</style>
