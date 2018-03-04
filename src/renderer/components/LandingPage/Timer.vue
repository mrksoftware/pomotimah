<template>
  <div id="container">
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
</template>

<script>
  import VueCircle from 'vue2-circle-progress'
  import VueCountdown from './../../utils/countdown'

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
        this.remainingMilliseconds = args.remainingMilliseconds
        this.$refs.progressCircle.updateProgress((100 * this.remainingMilliseconds) / this.workMilliseconds)
      },
      onCountdownEnd () {
        this.$store.dispatch('moveToNextSlot')
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
        return `${Math.floor((this.$store.getters.getCurrentIteration + 1) / 2)}/4`
      },
      workMilliseconds () {
        return this.$store.getters.currentTimerValue * 1000
      },
      isTimerInProgress () {
        return this.$store.getters.isTimerInProgress
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/mixins.scss";

  div#container {
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
</style>

