<template>
    <div id="container">
    <div id="minimizedContainer" v-if="!isPromptingNextSlot">
      <vue-circle 
        id="progressCircle"
        ref="progressCircle"
        :progress="100" 
        :size="30"
        line-cap="round"
        :fill="fill"
        empty-fill="rgba(0, 0, 0, .1)"
        :animation-start-value="0.0"
        :start-angle="0"
        insert-mode="append"
        :thickness="2"
        :show-percent="true">
      </vue-circle>
      <div id="timerCotainer">
        <VueCountdown ref="countdown"
          id="countdown"
          :time="workMilliseconds"
          :interval="1000"
          :leading-zero="true"
          :emit-events="true"
          :auto-start="isTimerInProgress"
          @countdownprogress="onCountDownProgress"
          @countdownend="onCountdownEnd">
          <template slot-scope="props">{{ props.minutes }}:{{ props.seconds }}</template>
        </VueCountdown>
        <div id="spanContainer">
          <span id="slotName">{{ currentSlotName }}</span>
          <span id="iterationCount">{{ currentIteration }}</span>
        </div>
      </div>
    </div>
    <div id="maximizedContainer" v-else>
      <span>Do you wanna start your next slot?</span>
      <div id="buttonContainer">
        <button id="yesButton" @click="onYesButtonClicked()">Yep!</button>
        <button id="noButton" @click="onNoButtonClicked()">Nope!</button>
      </div>
    </div>
  </div>
</template>

<script>
  import VueCircle from 'vue2-circle-progress'
  import VueCountdown from './../../utils/countdown'
  const { remote } = require('electron')

  export default {
    name: 'Timer',
    components: { VueCircle, VueCountdown },
    data () {
      return {
        fill: {gradient: ['#c0392b']},
        remainingMilliseconds: this.$store.getters.currentTimerValue * 1000
      }
    },
    methods: {
      onCountDownProgress (args) {
        let window = remote.getCurrentWindow()
        this.remainingMilliseconds = args.remainingMilliseconds
        let progressValue = (100 * this.remainingMilliseconds) / this.workMilliseconds
        this.$refs.progressCircle.updateProgress(progressValue)
        window.setProgressBar(progressValue / 100, {mode: this.getTaskBarProgressBarMode()})
      },
      getTaskBarProgressBarMode () {
        switch (this.currentSlotName) {
          case 'work':
            return 'error'
          case 'short-break':
            return 'pause'
          case 'long-break':
            return 'normal'
          default:
            return 'normal'
        }
      },
      onCountdownEnd () {
        let window = remote.getCurrentWindow()
        this.$store.dispatch('setMinimizedPosition', window.getPosition())
        // maximaze and prompt state change
        window.center()
        window.maximize()
        this.$store.dispatch('promptNextSlot')
        window.setIgnoreMouseEvents(false)
        window.flashFrame(true)
      },
      onYesButtonClicked () {
        let { x, y } = this.$store.getters.getMinimizedPosition
        let window = remote.getCurrentWindow()
        window.setPosition(x, y, true)
        window.setContentSize(200, 46 + 9) // Dunno why.. but it doesn't respect the size I put.. ¯\_(ツ)_/¯
        this.$store.dispatch('startTimer')
        this.$store.dispatch('moveToNextSlot')
        window.setIgnoreMouseEvents(true, {forward: true})
      },
      onNoButtonClicked () {
        let { x, y } = this.$store.getters.getMinimizedPosition
        let window = remote.getCurrentWindow()
        window.setPosition(x, y, true)
        window.setContentSize(200, 46 + 9) // Dunno why.. but it doesn't respect the size I put.. ¯\_(ツ)_/¯
        this.$store.dispatch('pauseTimer')
        this.$store.dispatch('moveToNextSlot')
        window.setIgnoreMouseEvents(true, {forward: true})
      }
    },
    mounted () {
      this.$bus.$on('startTimer', () => {
        if (this.$refs.countdown === undefined) {
          return
        }
        if (this.isTimerInProgress) {
          this.$refs.countdown.pause()
          this.$store.dispatch('pauseTimer')
        } else {
          this.$refs.countdown.start()
          this.$store.dispatch('startTimer')
        }
      })
    },
    computed: {
      currentSlotName () {
        return this.$store.getters.currentSlotName
      },
      currentIteration () {
        return `${Math.floor((this.$store.getters.getCurrentIteration + 1) / 2)}/8`
      },
      workMilliseconds () {
        return this.$store.getters.currentTimerValue * 1000
      },
      isTimerInProgress () {
        return this.$store.getters.isTimerInProgress
      },
      isPromptingNextSlot () {
        return this.$store.getters.isPromptingNextSlot
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/mixins.scss";

  div#container {
    display: flex;
    flex-grow: 1;

    div#minimizedContainer {
      display: flex;
      flex-grow: 1;
      align-items: center;
      @include disable-selection();

      #progressCircle {
        margin: 12px;
      }

      #timerCotainer {
        display: flex;
        flex-direction: column;
        flex-grow: 1;

        #countdown {
          display: flex;
          flex-grow: 1;
          font-size: 16px;
          font-weight: 100;
        }

        div#spanContainer {
          display: flex;
          flex-direction: row;
          flex-grow: 1;
          font-size: 9px;
          text-transform: uppercase;
          padding-right: 6px;

          #slotName {
            flex-grow: 1;
          }
        }
      }
    }

    div#maximizedContainer {
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: rgba(51, 51, 51, 0.95);

      div#buttonContainer {
        display: flex;
        margin: 12px;

        button {
          width: 120px;
          text-align: center;
          margin: 12px;
          height: 30px;

          &#yesButton {
            @include bg-color-button(#27ae60);
            border-radius: 2px;
          }

          &#noButton {
            @include bg-color-button(#c0392b);
            border-radius: 2px;
          }
        }
      }
    }
  }
</style>
