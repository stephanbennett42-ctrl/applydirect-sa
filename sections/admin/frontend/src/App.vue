<template>
  <div id="app-wrapper">
    <main>
      <router-view />
    </main>
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
}
</style>