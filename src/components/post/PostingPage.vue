<template>
  <div class="container">
    <div class="row">
      <div class="col-2">
        <label for="post-category" class="form-label">Category</label>
        <select id="post-category" class="form-select" aria-label="Select category of posting"
          v-model="postData.category">
          <option value="daily">Daily</option>
          <option value="work">Work</option>
          <option value="study">Study</option>
        </select>
      </div>
      <div class="col-10">
        <label for="post-title" class="form-label">Title</label>
        <input type="text" class="form-control" id="post-title" v-model="postData.title" />
      </div>
    </div>

    <div class="mb-3"></div>
    <ToastEditor v-model="postData.content" @add-image="handleImageUpload" @update:modelValue="updateContent" />

    <div class="mb-3">
      <label for="post-summary" class="form-label">설명</label>
      <input type="text" class="form-control" id="post-summary" v-model="postData.summary" maxlength="150"
        placeholder="이 글의 핵심내용 간단히 요약" />
    </div>

    <div class="buttons">
      <button type="button" class="btn btn-outline-dark" @click="savePost">
        <span v-if="uiState.saving">
          <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
          <span ref="saveBtn" role="status">저장 중...</span>
        </span>
        <span v-else>저장</span>
      </button>
      <button type="button" class="btn btn-outline-dark" @click="handleCancel">취소</button>
    </div>

    <div v-if="uiState.hasUnsavedChanges" class="unsaved-warning">
      <small class="text-warning">⚠️ 저장되지 않은 변경사항이 있습니다</small>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import ToastEditor from "../toast/ToastEditor.vue";
import Constant from "../../constant.js";
import { getRandomString } from "../../utility.js";
import { addDocument, setDocument, getDocument, updateDocument, uploadFile, getUrl } from '../../firebase/firebase-app.js';
import { useAuthStore } from '../../stores/auth.js';
import { usePreferencesStore } from '../../stores/preferences.js';
import { storeToRefs } from 'pinia';
import { createPostMeta } from "../../models/post-meta.js";
import { createPostContent } from '@/models/post-content';
import { useToast } from 'vue-toastification'
import imageCompression from 'browser-image-compression';
import heic2any from 'heic2any';
import logger from '../../utils/logger.js';

const router = useRouter();
const route = useRoute();
const toast = useToast();

// Stores
const authStore = useAuthStore();
const preferencesStore = usePreferencesStore();
const { user } = storeToRefs(authStore);
const { preferences } = storeToRefs(preferencesStore);

// Constants
const BOARD_INFO = Constant.BOARD_INFO;
const BOARD_CONTENT = Constant.BOARD_CONTENT;

// Post data (grouped related state)
const postData = reactive({
  title: "",
  category: "",
  content: "",
  summary: "",
  images: [],
  imageUrls: [],
});

// UI state (grouped related state)
const uiState = reactive({
  loading: false,
  saving: false,
  hasUnsavedChanges: false,
});

// Post metadata
const id = ref(route.params.id || "");
const editMode = computed(() => route.query.edit === "true");
const randomValue = ref("");

// Auto-save
let autoSaveTimer = null;

// Watch for changes to mark unsaved
watch(() => postData, () => {
  uiState.hasUnsavedChanges = true;

  // Auto-save if enabled
  if (preferences.value.autoSaveDrafts && !editMode.value) {
    scheduleDraftAutoSave();
  }
}, { deep: true });

// Warn before leaving with unsaved changes
onBeforeRouteLeave((to, from, next) => {
  if (uiState.hasUnsavedChanges && !confirm('저장되지 않은 변경사항이 있습니다. 페이지를 벗어나시겠습니까?')) {
    next(false);
  } else {
    next();
  }
});

onMounted(() => {
  randomValue.value = getRandomString();

  // Load existing post or draft
  if (id.value) {
    loadPostData();
  } else {
    loadDraftFromLocalStorage();
  }

  logger.debug('Post ID:', id.value);
  logger.debug('Edit mode:', editMode.value);
});

onBeforeUnmount(() => {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer);
  }
});

const loadPostData = async () => {
  try {
    uiState.loading = true;
    const metaSnapshot = await getDocument(BOARD_INFO, id.value);
    if (metaSnapshot.exists()) {
      const meta = metaSnapshot.data();
      postData.title = meta.title;
      postData.summary = meta.summary;
      postData.category = meta.category;

      const contentSnapshot = await getDocument(BOARD_CONTENT, id.value);
      if (contentSnapshot.exists()) {
        updateContent(contentSnapshot.data().content);
      }

      // Reset unsaved changes flag after loading
      uiState.hasUnsavedChanges = false;
    } else {
      logger.warn("Document not found:", id.value);
    }
  } catch (error) {
    logger.error("Error fetching document:", error);
  } finally {
    uiState.loading = false;
  }
};

// Draft auto-save functionality
const getDraftKey = () => `post-draft-${user.value?.uid || 'anonymous'}`;

const saveDraftToLocalStorage = () => {
  try {
    const draft = {
      title: postData.title,
      category: postData.category,
      content: postData.content,
      summary: postData.summary,
      timestamp: Date.now(),
    };
    localStorage.setItem(getDraftKey(), JSON.stringify(draft));
    logger.debug('Draft saved to localStorage');
  } catch (error) {
    logger.error('Failed to save draft:', error);
  }
};

const loadDraftFromLocalStorage = () => {
  try {
    const draftStr = localStorage.getItem(getDraftKey());
    if (draftStr) {
      const draft = JSON.parse(draftStr);
      const ageInMinutes = (Date.now() - draft.timestamp) / 1000 / 60;

      // Only load drafts less than 24 hours old
      if (ageInMinutes < 24 * 60) {
        if (confirm('저장된 임시 글이 있습니다. 불러오시겠습니까?')) {
          postData.title = draft.title || '';
          postData.category = draft.category || '';
          postData.content = draft.content || '';
          postData.summary = draft.summary || '';
          logger.info('Draft loaded from localStorage');
        }
      } else {
        // Clear old draft
        localStorage.removeItem(getDraftKey());
      }
    }
  } catch (error) {
    logger.error('Failed to load draft:', error);
  }
};

const clearDraftFromLocalStorage = () => {
  try {
    localStorage.removeItem(getDraftKey());
    logger.debug('Draft cleared from localStorage');
  } catch (error) {
    logger.error('Failed to clear draft:', error);
  }
};

const scheduleDraftAutoSave = () => {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer);
  }

  autoSaveTimer = setTimeout(() => {
    saveDraftToLocalStorage();
  }, preferences.value.autoSaveInterval || 30000);
};

const handleImageUpload = async (blob, callback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const heicTypes = ['image/heic', 'image/heif'];

  let imageBlob = blob;

  // HEIC/HEIF 포맷인 경우 JPEG로 변환
  if (heicTypes.includes(blob.type) || blob.name?.toLowerCase().endsWith('.heic') || blob.name?.toLowerCase().endsWith('.heif')) {
    try {
      toast.info('HEIC 이미지를 변환 중입니다...');
      const convertedBlob = await heic2any({
        blob: blob,
        toType: 'image/jpeg',
        quality: 0.9,
      });
      // heic2any는 배열 또는 단일 Blob을 반환할 수 있음
      imageBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      logger.debug('HEIC converted to JPEG successfully');
    } catch (error) {
      logger.error('HEIC conversion failed:', error);
      toast.error('HEIC 이미지 변환에 실패했습니다.');
      return;
    }
  } else if (!allowedTypes.includes(blob.type)) {
    toast.error('지원하지 않는 이미지 형식입니다. (JPG, PNG, WebP, HEIC 지원)');
    return;
  }

  if (imageBlob.size > Constant.IMG_MAX_BYTE) {
    toast.error("이미지 하나는 5MB 미만이어야합니다.");
    return;
  }

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };

  try {
    const compressedBlob = await imageCompression(imageBlob, options);

    const timestamp = Date.now();
    const extension = compressedBlob.type.split('/').pop();
    const fileName = `${randomValue.value}_${timestamp}.${extension}`;
    const path = `${Constant.STOR_IMG_PATH}/${randomValue.value}/${fileName}`;

    postData.images.push(path);
    await uploadFile(path, compressedBlob);
    const url = await getUrl(path);
    postData.imageUrls.push(url);
    callback(url, "test");
  } catch (error) {
    logger.error("Error uploading or getting URL:", error);
    toast.error("이미지 업로드 중 오류가 발생했습니다.");
  }
};

const updateContent = newContent => {
  postData.content = newContent;
};

const handleCancel = () => {
  if (uiState.hasUnsavedChanges) {
    if (confirm('저장되지 않은 변경사항이 있습니다. 취소하시겠습니까?')) {
      router.go(-1);
    }
  } else {
    router.go(-1);
  }
};

const savePost = async () => {
  if (!user.value) {
    toast.error("Authentication error. Please log in again.");
    router.push('/sign-in');
    return;
  }

  try {
    uiState.saving = true;

    if (!postData.title.trim() || !postData.content.trim() || !postData.category) {
      toast.error("제목과 내용을 입력하세요.");
      uiState.saving = false;
      return;
    }

    logger.debug('Edit mode:', route.query.edit);
    const postMeta = createMetaData(user.value.uid);
    const postContent = createContentData(id.value || "");

    if (editMode.value) {
      // Update existing document
      await updateDocument(BOARD_INFO, id.value, postMeta);
      await updateDocument(BOARD_CONTENT, id.value, postContent);
    } else {
      // Create new document
      const docMetaId = await addDocument(BOARD_INFO, postMeta);
      postContent.id = docMetaId;
      await setDocument(BOARD_CONTENT, docMetaId, postContent);
    }

    // Clear draft and unsaved changes flag
    clearDraftFromLocalStorage();
    uiState.hasUnsavedChanges = false;

    toast.success('게시글이 저장되었습니다.');
    router.push("/posts");

  } catch (error) {
    logger.error("게시글 저장 중 오류가 발생했습니다. 다시 시도해주세요.", error);
    toast.error("게시글 저장에 실패했습니다.");
  } finally {
    uiState.saving = false;
  }
};

const createMetaData = uid => createPostMeta({
  title: postData.title,
  category: postData.category,
  summary: postData.summary,
  user: uid,
});

const createContentData = docId => createPostContent({
  id: docId,
  content: postData.content,
  images: [...postData.images],
  imageUrls: [...postData.imageUrls],
});


</script>

<style scoped>
.unsaved-warning {
  margin-top: 1rem;
  padding: 0.5rem;
  text-align: center;
}

.text-warning {
  color: #f59e0b;
}
</style>

<style scoped>
.mb-3 {
  margin-top: 1vh;
}
</style>