<template>
    <div class="container">
        <div class="mb-3">
            <label for="post-title" class="form-label">Title</label>
            <input type="text" class="form-control" id="post-title" v-model="postTitle" />
        </div>

        <ToastEditor v-model="content" @add-image="addImage" @update:modelValue="updateContent" />

        <div class="buttons">
            <button type="button" class="btn red-button" @click="savePost()">
            <span v-if="saving">
                <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <span ref="saveBtn" role="status">저장 중...</span>
            </span>
            <span v-if="!saving">저장</span>
            </button>
            <button type="button" class="btn btn-light" @click="$router.go(-1)">
                취소
            </button>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ToastEditor from "../toast/ToastEditor.vue"
import Constant from "../../constant.js"
import {getRandomString} from "../../utility.js"
import { observeAuthState } from '../../firebase/auth.js'
import { addDocument, setDocument, getDocument } from '../../firebase/firestore.js'
import { uploadFile, getUrl} from '../../firebase/firestorage.js'
import PostMeta from "../../models/post-meta.js"
import PostContent from "../../models/post-content.js"

const router = useRouter()
const route = useRoute()

const postTitle = ref("")
const content = ref("<p>내용을 작성하세요</p>")
const images = ref([])
const attachments = ref([])
const loading = ref(false)
const id = ref(route.params.id ? route.params.id : "")
const saving = ref(false)
const userUid = ref("")
const randomValue = ref("")

const BOARD_META = Constant.TIL_BOARD_META
const BOARD_CONTENT = Constant.TIL_BOARD_CONTENT

onMounted(async () => {
  randomValue.value = getRandomString()

  observeAuthState((user) => {
    if (user) {
      console.log(`logged in ${user.uid}`)
      userUid.value = user.uid
    } else {
      console.log('no user')
    }
  }

  )

  if (id.value !== "") {
    console.log('loading the existed posting data...')
    try {
        const docSnapshot = await getDocument(BOARD_META, id.value);
      if (docSnapshot.exists()) {
        const meta = docSnapshot.data();

        //제목
        postTitle.value = meta.title

        const contentSnapshot = await getDocument(BOARD_CONTENT, id.value);
        if (contentSnapshot.exists()) {
          const detail = contentSnapshot.data();
          updateContent(detail.content.value)
        }
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    } finally {
      loading.value = false; // Set loading to false when done
    }
  }
})

const addImage = async (blob, callback) => {
  if (Constant.IMG_MAX_BYTE <= blob.size) {
    alert("이미지 하나는 5MB 미만이어야합니다.");
    return;
  }

  const path = `${Constant.STOR_IMG_PATH}/${randomValue.value}/${blob.name}`;
  images.value.push(path);
  console.log(images.value);
  try {
    const snapshot = await uploadFile(path, blob);
    console.log("snapshot ;", snapshot);
    const url = await getUrl(path);
    console.log("url : ", url);
    callback(url, "test");
  } catch (error) {
    console.error("Error uploading or getting URL:", error);
  }
}


const updateContent = (newContent) => {
  content.value = newContent
}

const savePost = async () => {
  try {
    saving.value = true

    const postMeta = await setMetaData(userUid.value);

    // Now, you can proceed to save the data to Firestore
    const docMetaId = await addDocument(Constant.TIL_BOARD_META, postMeta)
    const postContent = await setContentData(docMetaId)
    await setDocument(Constant.TIL_BOARD_CONTENT, docMetaId, postContent);

    router.push("/til")
    
  } catch (error) {
    console.error("Error saving post: ", error)
  } finally {
    saving.value = false
  }
}

const setMetaData = async (uid) => {
  const meta = PostMeta;
  meta.title = postTitle.value;
  meta.createDt = new Date().toISOString();
  meta.hit = 0;
  meta.user = uid;
  return meta;
}

const setContentData = async (docId) => {
  const data = PostContent;
  data.id = docId;
  data.content = content.value;
  data.images = [...images.value];

  for (const file of attachments.value) {
    const path = `${Constant.ATTACH_FILE_PATH}/${randomValue.value}/${file.name}`;
    data.attachments.push(path);
    try {
      await uploadFile(path, file);
      const url = await getUrl(path);
      console.log("url : ", url);
      data.attachUrls.push(url);
    } catch (error) {
      console.error("Error uploading or getting URL:", error);
    }
  }
  return data;
}

</script>
<style lang="">
    
</style>