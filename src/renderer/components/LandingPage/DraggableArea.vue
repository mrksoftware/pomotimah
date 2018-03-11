<template>
  <div id="draggableArea" @mousemove="onMouseMove()" v-bind:class="{isDraggable: !isDraggable, isPromptingNextSlot: isPromptingNextSlot}">
    <button id="playPauseButton" @click="onPlayClick()" @mouseover="onMouseMove()">{{ playPauseButtonText }}</button>
    <div class="draggerContainer">
      <span class="draggerSpan">···</span>
      <span class="draggerSpan">···</span>
    </div>
    <button id="skipButton" @click="onSkipClick()" @mouseover="onMouseMove()">►❚</button>
  </div>
</template>

<script>
const { remote, ipcRenderer } = require('electron')
let timer

export default {
  name: 'DraggableArea',
  data () {
    return {
      isDraggable: false
    }
  },
  methods: {
    onMouseMove: function () {
      this.isDraggable = true
      var window = remote.getCurrentWindow()
      window.setIgnoreMouseEvents(false)
      this.debounceDisableClick()
    },
    onPlayClick: function () {
      this.debounceDisableClick()
      this.$bus.$emit('startTimer')
    },
    onSkipClick: function () {
      this.debounceDisableClick()
      this.$store.dispatch('moveToNextSlot')
    },
    debounceDisableClick: function () {
      clearTimeout(timer)
      let self = this // eslint-disable-line no-unused-vars
      timer = setTimeout(function () {
        if (!this.isPromptingNextSlot) {
          self.isDraggable = false
          var window = remote.getCurrentWindow()
          window.setIgnoreMouseEvents(true, {forward: true})
        }
      }, 2000)
    }
  },
  mounted () {
    ipcRenderer.on('play-pause-timer', () => {
      this.onPlayClick()
    })
    ipcRenderer.on('skip-slot', () => {
      this.onSkipClick()
    })
  },
  computed: {
    playPauseButtonText () {
      if (this.$store.getters.isTimerInProgress) {
        return '❚❚'
      } else {
        return '►'
      }
    },
    isPromptingNextSlot () {
      return this.$store.getters.isPromptingNextSlot
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/variables.scss";
@import "../../../styles/mixins.scss";

div#draggableArea {
  display: flex;
  flex-direction: column;
  flex-basis: $draggable-area-width;
  align-self: stretch;
  background: rgba($draggable-area-background,0.75);;
  justify-content: space-around;
  @include disable-selection();
  @include animate-property(background-color, $animation-speed);

  &.isDraggable {
    background: rgba($draggable-area-background,0.3);
    @include animate-property(background-color, $animation-speed);
  }

  &.isPromptingNextSlot {
    background: rgba($draggable-area-background,1);

    button {
      display: none;
    }
  }

  button {
    -webkit-app-region: no-drag;
    background: transparent;
    border: transparent;

    &#playPauseButton {
      @include color-button(green);
      font-size: 9.5px;
    }

    &#skipButton {
      @include color-button(orange);
      font-size: 8.5px;
    }

  }

  div.draggerContainer {
    -webkit-app-region: drag;
    display: flex;
    flex-direction: column;
    align-self: center;
    justify-self: center;
    font-weight: bold;
    box-sizing: border-box;
    text-align: center;
    line-height: 5px;
    color: lighten($draggable-area-background, 20);
  }
}
</style>

