<template>
    <div ref="editorRef">EditorRef</div>
  </template>
  
  <script setup>
  import Editor from "@toast-ui/editor";
  import "@toast-ui/editor/dist/toastui-editor.css"; // Editor's Style
  import { ref, onMounted } from "vue";
  
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
  
  // const add = (file) =>{
  //   const callback = (url, fileInfo) =>{
      
  //     const range = editor.getSelection()
  //     console.log(`[ToastUI] url : ${url}, fileInfo : ${fileInfo}, range : ${range}`)
  //     editor.insertImage(range, url, fileInfo.originalFilename)
  //   }
  //   emits('addImage', file, callback)
  // }
  
  onMounted(() => {
    editor = new Editor({
      el: editorRef.value,
      height: "500px",
      initialEditType: "wysiwyg",
      previewStyle: "vertical",
      initialValue: props.modelValue,
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
  });
  </script>
  
  <style>
  </style>