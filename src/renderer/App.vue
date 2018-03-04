<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'pomotimah'
  }
</script>

<style lang="scss">
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-decoration: none;
  // user-select: none;
  &::-webkit-scrollbar { width: 0 !important }

  &:hover,
  &:focus,
  &:active{
      outline: none;
  }
}

body{
  margin: 0;
  padding: 0px;
  font-family: "Source Sans Pro", sans-serif;
  color: white;
  overflow: hidden;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
}

</style>

