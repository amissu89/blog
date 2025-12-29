<template>
    <div ref="viewerRef" class="tui-border"></div>
  </template>
  
  <script setup>
  import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
  import "@toast-ui/editor/dist/toastui-editor-viewer.css";
  import { ref, onMounted } from "vue";
  import logger from '../../utils/logger.js';

  const viewerRef = ref();
  const props = defineProps({
    content: String,
  });

  onMounted(() => {
    // Initialize Toast UI viewer
    // eslint-disable-next-line no-unused-vars
    const viewer = new Viewer({
      el: viewerRef.value,
      initialValue: props.content,
    });

    logger.debug('Toast viewer initialized');
  });
  </script>
  
  <style scoped>
  .tui-border{
    margin: 3vh 0 0 0;
    height: auto;
    min-height:50vh;
  }
  </style>