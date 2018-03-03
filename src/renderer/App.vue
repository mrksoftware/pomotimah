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
  padding: 2px;
  background-color: rgba(0,0,30,0.15);
  overflow: hidden;
  opacity: 0.95;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
}


// Webview
// Webview
// Webview
#browserView{
    display: block;
    width: 100%;
    // width: calc(100% + 22px) !important;
    height: 100%;
    height: calc(100vh - 78px) !important;
    margin-top: 32px;
    // height: 100vh !important;
    z-index: 5;
    background-color: white;

    &.full-size{
        height: 100vh !important;
        margin-top: 0;
    }
}
</style>

