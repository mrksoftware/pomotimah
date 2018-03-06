<template>
  <div id="wrapper">
    <Timer></Timer>
    <DraggableArea></DraggableArea>
  </div>
</template>

<script>
import Timer from './LandingPage/Timer'
import DraggableArea from './LandingPage/DraggableArea'

export default {
  name: 'LandingPage',
  components: {Timer, DraggableArea}
}
</script>

<style lang="scss">

div#wrapper {
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  height: 100vh !important;
  margin-top: 0px;
  background-color: rgba(51, 51, 51, 0.4);
}

</style>
