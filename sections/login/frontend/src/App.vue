<template>
  <div id="app-wrapper">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
#app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>