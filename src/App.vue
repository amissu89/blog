<template>
  <div class="container">
    <div class="d-flex flex-column min-vh-100">
    <NavTop />
    <div class="flex-grow-1">
      <Canvas />
    </div>
    
    <Footer />
  </div>
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
