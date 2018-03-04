<template>
  <div id="container">
    <vue-circle 
      id="progressCircle"
      :progress="80" 
      :size="40"
      line-cap="round"
      :fill="fill"
      empty-fill="rgba(0, 0, 0, .1)"
      :animation-start-value="0.0"
      :start-angle="0"
      insert-mode="append"
      :thickness="2"
      :show-percent="true">
    </vue-circle>
    <span id="timerValue">25:00</span>
  </div>
</template>

<script>
  import VueCircle from 'vue2-circle-progress'

  export default {
    name: 'Timer',
    components: { VueCircle },
    data () {
      return {
        fill: {gradient: ['#c0392b']}
      }
    }
  }
</script>

<style lang="scss" scoped>
  div#container {
    display: flex;
    flex-grow: 1;
    align-items: center;

    #progressCircle {
      margin: 12px;
    }

    #timerValue {
      font-size: 24px;
      font-weight: 100;
    }
  }
</style>

