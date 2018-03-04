<template>
  <div id="draggableArea" @mousemove="onMouseMove()" v-bind:class="{isDraggable: !isDraggable}">
    <button id="playPauseButton" @click="onPlayClick()" @mouseover="onMouseMove()">►</button>
    <span class="draggerSpan">···</span>
    <span class="draggerSpan">···</span>
    <button id="skipButton" @click="onSkipClick()" @mouseover="onMouseMove()">≤</button>
  </div>
</template>

<script>
const { remote } = require('electron')
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
    },
    onSkipClick: function () {
      this.debounceDisableClick()
    },
    debounceDisableClick: function () {
      clearTimeout(timer)
      let self = this // eslint-disable-line no-unused-vars
      timer = setTimeout(function () {
        self.isDraggable = false
        var window = remote.getCurrentWindow()
        window.setIgnoreMouseEvents(true, {forward: true})
      }, 2000)
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
  background: $draggable-area-background;
  justify-content: center;
  @include disable-selection();
  @include animate-property(background-color, $animation-speed);

  &.isDraggable {
    background: rgba($draggable-area-background,0.5);
    @include animate-property(background-color, $animation-speed);
  }

  button {
    -webkit-app-region: no-drag;
    background: transparent;
    border: transparent;
    
    &#playPauseButton {
      @include color-button(green);
    }

    &#skipButton {
      @include color-button(orange);
    }

  }

  span.draggerSpan {
    -webkit-app-region: drag;
    display: flex;
    align-self: center;
    justify-self: center;
    font-weight: bold;
    box-sizing: border-box;
    text-align: center;
    line-height: 8px;
    color: lighten($draggable-area-background, 20);
  }
}
</style>

