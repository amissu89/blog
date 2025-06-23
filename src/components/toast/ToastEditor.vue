<template>
    <div ref="editorRef"></div>
  </template>
  
  <script setup>
  import Editor from "@toast-ui/editor";
  import "@toast-ui/editor/dist/toastui-editor.css"; // Editor's Style
  import { ref, onMounted, watch } from "vue";
  
  const editorRef = ref();
  let editor = null;
  const props = defineProps({
      modelValue: String,
  })
  const emits = defineEmits(
      [
        'update:modelValue',
        'addImage',
      ]
  )
  
  const add = (file , callback) => {
    emits('addImage', file, callback)
  }

  onMounted(() => {
    editor = new Editor({
      el: editorRef.value,
      height: "500px",
      initialEditType: "wysiwyg",
      previewStyle: "vertical",
      initialValue: props.modelValue, // 처음 에디터 로드 시 초기값 설정
      events:{
          change:()=>{
              const content = editor.getHTML()
              emits('update:modelValue', content)
          }
      },
      hooks:{
        addImageBlobHook: add,
      }
    });

    // modelValue 변경 감지하여 에디터 업데이트
    watch(
      () => props.modelValue,
      (newValue) => {
        if (editor && newValue !== editor.getHTML()) {
          editor.setHTML(newValue);
        }
      }
    );

  });
  </script>
  
  <style>
  </style>