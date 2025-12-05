<template>
    <div class="container">
        <div v-if="loading">Loading...</div>
        <div v-else-if="!meta">
            <p>게시글이 존재하지 않거나 삭제되었습니다.</p>
        </div>
        <div v-else>
            <h2> [{{ meta.category }}] {{ meta.title }}</h2>
            <hr class="border border-dark border-1 opacity-100" />
            <p>
                {{ new Date(meta.createDt).toLocaleString() }}
                <span v-if="adminMode"> <button type="button" class="btn btn-outline-dark"
                        @click="editMode(content.id)">수정 </button> </span> &nbsp;
                <span v-if="adminMode"> <button type="button" class="btn btn-outline-dark"
                        @click="deleteMode(content.id)">삭제 </button> </span>
            </p>
            <ToastViewer :content="content.content" />

            <button type="button" class="btn btn-outline-dark float-right" @click="$router.go(-1)">목록으로</button>
        </div>

    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, computed, watchEffect } from 'vue'
import { getDocument, deleteDocument, deleteFiles, observeAuthState } from '../../firebase/firebase-app.js'
import Constant from '../../constant.js'
import ToastViewer from '../toast/ToastViewer.vue'
import { useHead } from '@vueuse/head'

const route = useRoute()
const router = useRouter()

const id = ref('')
const meta = ref(null)
const content = ref(null)
const loading = ref(true)
const adminMode = ref(false)

const title = computed(() => meta.value?.title || '글 제목 없음')
const summary = computed(() => meta.value?.summary || '기본 요약 설명입니다')
const imageUrl = computed(() => content.value?.imageUrls?.[0] || null)

watchEffect(() => {
    if (meta.value && content.value) {
        useHead({
            title: title,
            meta: [
                {
                    name: 'description',
                    content: summary,
                },
                {
                    property: 'og:title',
                    content: title,
                },
                {
                    property: 'og:description',
                    content: summary,
                },
                {
                    property: 'og:type',
                    content: 'article',
                },
                {
                    property: 'twitter:card',
                    content: 'summary',
                },
                ...(imageUrl.value ? [{ property: 'og:image', content: imageUrl.value }] : [])
            ]
        })
    }
})

onMounted(async () => {
    // Observe authentication state and set admin mode if user is logged in
    observeAuthState((user) => {
        if (user) {
            adminMode.value = true
        }
    })

    try {
        id.value = route.params.id

        // Fetch meta information
        const docSnapshot = await getDocument(Constant.BOARD_INFO, id.value)
        if (docSnapshot.exists()) {
            meta.value = docSnapshot.data()

            // Fetch content information
            const contentSnapshot = await getDocument(Constant.BOARD_CONTENT, id.value)
            if (contentSnapshot.exists()) {
                content.value = contentSnapshot.data()
            }
        } else {
            console.log('No such document')
        }
    } catch (error) {
        console.error("Error fetching document: ", error)
    } finally {
        loading.value = false
    }
})




// Navigate to edit mode with parameters
const editMode = (id) => {
    try {
        router.push({
            name: 'edit-post',
            params: {
                id: id.value,
            },
            query: {
                edit: true,
            },
        })
    } catch (error) {
        console.error("Error navigating to edit mode: ", error)
    }
}

// Delete the post after confirmation
const deleteMode = async (id) => {
    console.log("Deleting meta with ID: ", id)
    const isConfirmed = window.confirm("이 글을 삭제하시겠습니까?")
    if (isConfirmed) {
        try {
            // Delete content

            const contentImageUrls = content.value.images

            deleteFiles(contentImageUrls)

            // Step 3: Delete Firestore documents
            await deleteDocument(Constant.BOARD_CONTENT, id)
            // Delete meta information
            await deleteDocument(Constant.BOARD_INFO, id)

            router.go(-1)
        } catch (error) {
            console.error("Error deleting document: ", error)
        }
    }
}

</script>

<style scoped>
.container {
    margin-top: 2vh;
}

.float-right {
    float: right;
}
</style>