<template>
    <div ref="viewerRef" class="tui-border"></div>
  </template>
  
  <script setup>
  import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
  import "@toast-ui/editor/dist/toastui-editor-viewer.css";
  import { ref, onMounted } from "vue";
  
  const viewerRef = ref();
  let viewer = null;
  const props = defineProps({
    content: String,
  });
  
  onMounted(() => {
  
    viewer = new Viewer({
      el: viewerRef.value,
      height: "600px",
      initialValue: props.content,
    });
  
    console.log(viewer)
  });
  </script>
  
  <style scoped>
  .tui-border{
    margin: 3vh 0 0 0;
  }
  </style>