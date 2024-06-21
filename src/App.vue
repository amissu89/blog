<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <div class="container">
    <NavTop @navigate="currentComponent = $event" />
    <component :is="currentComponent"></component>
  </div>
</template>

<script> 
import NavTop from './components/NavTop.vue'
import ProfilePage from './components/ProfilePage.vue'
import TilPage from './components/TilPage.vue'

export default {
  name: 'App',
  components : {
    NavTop,
    ProfilePage,
    TilPage
  },
  data(){
    return {
      currentComponent: null,
    }
  }
}
</script>

<style>
</style>
