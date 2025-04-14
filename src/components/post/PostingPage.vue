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
import { addDocument, setDocument, getDocument } from '../../firebase/firestore.js';
import { uploadFile, getUrl } from '../../firebase/firestorage.js';
import PostMeta from "../../models/post-meta.js";
import PostContent from "../../models/post-content.js";

const router = useRouter();
const route = useRoute();

const postTitle = ref("");
const category = ref("");
const content = ref("<p>내용을 작성하세요</p>");
const images = ref([]);
const loading = ref(false);
const id = ref(route.params.id || "");
const saving = ref(false);
const userUid = ref("");
const randomValue = ref("");

const BOARD_INFO = Constant.BOARD_INFO;
const BOARD_CONTENT = Constant.BOARD_CONTENT;

onMounted(() => {
  randomValue.value = getRandomString();
  observeAuthState(user => (user ? (userUid.value = user.uid) : console.log('No user')));
  if (id.value) loadPostData();
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
  if (blob.size > Constant.IMG_MAX_BYTE) {
    alert("이미지 하나는 5MB 미만이어야합니다.");
    return;
  }

  const path = `${Constant.STOR_IMG_PATH}/${randomValue.value}/${blob.name}`;
  images.value.push(path);

  try {
    await uploadFile(path, blob);
    const url = await getUrl(path);
    callback(url, "test");
  } catch (error) {
    console.error("Error uploading or getting URL:", error);
  }
};

const updateContent = newContent => {
  content.value = newContent;
};

const savePost = async () => {
  try {
    saving.value = true;

    const postMeta = createMetaData(userUid.value);
    const docMetaId = await addDocument(BOARD_INFO, postMeta);

    const postContent = createContentData(docMetaId);
    await setDocument(BOARD_CONTENT, docMetaId, postContent);

    router.push("/posts");
  } catch (error) {
    console.error("Error saving post:", error);
  } finally {
    saving.value = false;
  }
};

const createMetaData = uid => ({
  ...PostMeta,
  title: postTitle.value,
  createDt: new Date().toISOString(),
  hit: 0,
  user: uid,
  category: category.value,
});

const createContentData = docId => ({
  ...PostContent,
  id: docId,
  content: content.value,
  images: [...images.value],
});
</script>

<style scoped>
.mb-3 {
  margin-top: 1vh;
}
</style>