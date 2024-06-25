<template>
  <div class="container">
    <NavTop />
    <Canvas />
    <Footer />
  </div>
</template>

<script> 
import NavTop from './components/NavTop.vue'
import Canvas from './components/CanvasSection.vue'
import Footer from './components/FooterSection.vue'


export default {
  name: 'App',
  components : {
    NavTop,
    Canvas,
    Footer
  },
}
</script>

<style>
</style>
