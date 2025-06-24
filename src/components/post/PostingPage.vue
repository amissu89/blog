<template>
  <div class="container">
    <label for="post-category" class="form-label">Category</label>
    <select id="post-category" class="form-select" aria-label="Select category of posting" v-model="category">
      <option value="daily">Daily</option>
      <option value="work">Work</option>
      <option value="review">Review</option>
    </select>

    <div class="mb-3">
      <label for="post-title" class="form-label">Title</label>
      <input type="text" class="form-control" id="post-title" v-model="postTitle" />
    </div>

    <ToastEditor v-model="content" @add-image="handleImageUpload" @update:modelValue="updateContent" />

    <div class="buttons">
      <button type="button" class="btn btn-outline-dark" @click="savePost">
        <span v-if="saving">
          <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
          <span ref="saveBtn" role="status">저장 중...</span>
        </span>
        <span v-else>저장</span>
      </button>
      <button type="button" class="btn btn-outline-dark" @click="$router.go(-1)">취소</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ToastEditor from "../toast/ToastEditor.vue";
import Constant from "../../constant.js";
import { getRandomString } from "../../utility.js";
import { observeAuthState } from '../../firebase/auth.js';
import { addDocument, setDocument, getDocument, updateDocument } from '../../firebase/firestore.js';
import { uploadFile, getUrl } from '../../firebase/firestorage.js';
import { createPostMeta } from "../../models/post-meta.js";
import { createPostContent } from '@/models/post-content';
import { useToast } from 'vue-toastification'
import imageCompression from 'browser-image-compression';

const router = useRouter();
const route = useRoute();

const postTitle = ref("");
const category = ref("");
const content = ref("");
const images = ref([]);
const loading = ref(false);
const id = ref(route.params.id || "");
const editMode = ref(route.query.edit === "true");
const saving = ref(false);
const userUid = ref("");
const randomValue = ref("");

const BOARD_INFO = Constant.BOARD_INFO;
const BOARD_CONTENT = Constant.BOARD_CONTENT;

const toast = useToast()

onMounted(() => {
  randomValue.value = getRandomString();
  observeAuthState(user => (user ? (userUid.value = user.uid) : console.log('No user')));
  if (id.value) loadPostData();

  console.log(id.value);
  console.log(editMode.value);
});

const loadPostData = async () => {
  try {
    const metaSnapshot = await getDocument(BOARD_INFO, id.value);
    if (metaSnapshot.exists()) {
      const meta = metaSnapshot.data();
      postTitle.value = meta.title;
      category.value = meta.category;

      const contentSnapshot = await getDocument(BOARD_CONTENT, id.value);
      if (contentSnapshot.exists()) updateContent(contentSnapshot.data().content);
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching document:", error);
  } finally {
    loading.value = false;
  }
};

const handleImageUpload = async (blob, callback) => {

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(blob.type)) {
    toast.error('지원하지 않는 이미지 형식입니다.');
    return;
  }

  if (blob.size > Constant.IMG_MAX_BYTE) {
    toast.error("이미지 하나는 5MB 미만이어야합니다.");
    return;
  }

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  }

  try {

    const compressedBlob = await imageCompression(blob, options)

    const timestamp = Date.now()
    const extension = compressedBlob.type.split('/').pop()
    const fileName = `${randomValue.value}_${timestamp}.${extension}`;
    const path = `${Constant.STOR_IMG_PATH}/${randomValue.value}/${fileName}`;
    images.value.push(path);
    await uploadFile(path, compressedBlob);
    const url = await getUrl(path);
    callback(url, "test");
  } catch (error) {
    console.error("Error uploading or getting URL:", error);
    toast.error("이미지 업로드 중 오류가 발생했습니다.");
  }
};

const updateContent = newContent => {
  content.value = newContent;
};

const savePost = async () => {
  try {
    saving.value = true;
    if (!postTitle.value.trim() || !content.value.trim() || !category.value) {
      toast.error("제목과 내용을 입력하세요.");
      saving.value = false;
      return;
    }

    console.log(route.query.edit)
    const postMeta = createMetaData(userUid.value);
    const postContent = createContentData(id.value || "");

    if (editMode.value) {
      // Update existing document
      await updateDocument(BOARD_INFO, id.value, postMeta);
      await updateDocument(BOARD_CONTENT, id.value, postContent);
    } else {
      // Create new document
      const docMetaId = await addDocument(BOARD_INFO, postMeta);
      postContent.id = docMetaId
      await setDocument(BOARD_CONTENT, docMetaId, postContent);
    }

    router.push("/posts");


  } catch (error) {
    console.error("게시글 저장 중 오류가 발생했습니다. 다시 시도해주세요. ", error);
  } finally {
    saving.value = false;
  }
};

const createMetaData = uid => createPostMeta({
  title: postTitle.value,
  category: category.value,
  user: uid,
});

const createContentData = docId => createPostContent({
  id: docId,
  content: content.value,
  images: [...images.value],
})



</script>

<style scoped>
.mb-3 {
  margin-top: 1vh;
}
</style>