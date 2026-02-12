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

  <style>
  /* Toast UI Viewer 폰트 사이즈 */
  .toastui-editor-contents {
    font-family: 'Noto Serif KR', serif;
  font-size: 18px;
  line-height: 1.8;
  }
 
  .toastui-editor-contents p,
  .toastui-editor-contents li,
  .toastui-editor-contents td,
  .toastui-editor-contents th {
    font-size: 16px;
  }

  .toastui-editor-contents h1 {
    font-size: 28px;
  }

  .toastui-editor-contents h2 {
    font-size: 24px;
  }

  .toastui-editor-contents h3 {
    font-size: 20px;
  }

  .toastui-editor-contents h4 {
    font-size: 18px;
  }
  </style>