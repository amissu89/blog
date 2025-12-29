<template>
    <div class="container">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading post...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="!meta" class="error-state">
            <div class="error-icon">📭</div>
            <h3>Post not found</h3>
            <p>게시글이 존재하지 않거나 삭제되었습니다.</p>
            <button type="button" class="btn btn-outline-primary" @click="$router.go(-1)">목록으로 돌아가기</button>
        </div>

        <!-- Post Content -->
        <div v-else class="post-container">
            <div class="post-header">
                <span class="category-badge">{{ meta.category }}</span>
                <h1 class="post-title">{{ meta.title }}</h1>

                <div class="post-meta">
                    <span class="post-date">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                        </svg>
                        {{ new Date(meta.createDt).toLocaleString() }}
                    </span>

                    <div v-if="isAdmin" class="admin-actions">
                        <button type="button" class="btn btn-sm btn-edit" @click="editMode(content.id)">
                            ✏️ 수정
                        </button>
                        <button type="button" class="btn btn-sm btn-delete" @click="deleteMode(content.id)">
                            🗑️ 삭제
                        </button>
                    </div>
                </div>
            </div>

            <div class="post-content">
                <ToastViewer :content="content.content" />
            </div>

            <div class="post-footer">
                <button type="button" class="btn btn-back" @click="$router.go(-1)">
                    ← 목록으로
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, computed, watch } from 'vue'
import { getDocument, deleteDocument, deleteFiles } from '../../firebase/firebase-app.js'
import { useAuthStore } from '../../stores/auth.js'
import { storeToRefs } from 'pinia'
import Constant from '../../constant.js'
import ToastViewer from '../toast/ToastViewer.vue'
import { useSeo, generateBlogPostStructuredData, injectStructuredData } from '../../composables/useSeo.js'
import logger from '../../utils/logger.js'

const route = useRoute()
const router = useRouter()

const id = ref('')
const meta = ref(null)
const content = ref(null)
const loading = ref(true)

const authStore = useAuthStore()
const { isAdmin } = storeToRefs(authStore)

const seoOptions = computed(() => {
    if (!meta.value || !content.value) return {}

    return {
        title: meta.value.title || '글 제목 없음',
        description: meta.value.summary || '기본 요약 설명입니다',
        image: content.value.imageUrls?.[0] || 'https://yllee.pe.kr/thumbnail.png',
        url: `https://yllee.pe.kr/view/${id.value}`,
        type: 'article'
    }
})

// Initialize SEO
const { updateSeo } = useSeo(seoOptions.value)

// Watch for data changes and update SEO + structured data
watch([meta, content], ([newMeta, newContent]) => {
    if (newMeta && newContent) {
        // Update SEO meta tags
        updateSeo(seoOptions.value)

        // Generate and inject structured data (JSON-LD)
        const structuredData = generateBlogPostStructuredData({
            title: newMeta.title,
            content: newContent.content,
            summary: newMeta.summary,
            createDt: newMeta.createDt,
            updateDt: newMeta.updateDt,
            category: newMeta.category,
            id: id.value
        })
        injectStructuredData(structuredData)

        logger.debug('SEO and structured data updated for post:', newMeta.title)
    }
})

onMounted(async () => {
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
            logger.warn('Document not found:', id.value)
        }
    } catch (error) {
        logger.error("Error fetching document:", error)
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
                id: id,
            },
            query: {
                edit: true,
            },
        })
    } catch (error) {
        logger.error("Error navigating to edit mode:", error)
    }
}

// Delete the post after confirmation
const deleteMode = async (id) => {
    logger.info("Attempting to delete post:", id)
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
            logger.error("Error deleting document:", error)
        }
    }
}

</script>

<style scoped>
.container {
    margin-top: var(--spacing-xl);
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

/* Loading State */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-3xl);
    min-height: 400px;
}

.spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--color-border);
    border-top-color: var(--color-accent);
    border-radius: var(--radius-full);
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading-state p {
    margin-top: var(--spacing-lg);
    color: var(--color-text-secondary);
}

/* Error State */
.error-state {
    text-align: center;
    padding: var(--spacing-3xl);
    background: var(--color-card);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    margin: var(--spacing-xl) 0;
}

.error-icon {
    font-size: 4rem;
    margin-bottom: var(--spacing-lg);
    opacity: 0.5;
}

.error-state h3 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
}

.error-state p {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xl);
}

/* Post Container */
.post-container {
    background: var(--color-card);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    overflow: hidden;
    animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Post Header */
.post-header {
    padding: var(--spacing-2xl);
    background: linear-gradient(to bottom, var(--color-bg-secondary), var(--color-card));
    border-bottom: 2px solid var(--color-border-light);
}

.category-badge {
    display: inline-block;
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
    color: white;
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--radius-full);
    font-size: var(--font-size-sm);
    font-weight: 600;
    margin-bottom: var(--spacing-md);
}

.post-title {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: var(--spacing-lg);
    line-height: 1.3;
}

.post-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-md);
}

.post-date {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
}

.post-date svg {
    flex-shrink: 0;
}

/* Admin Actions */
.admin-actions {
    display: flex;
    gap: var(--spacing-sm);
}

.btn-edit,
.btn-delete {
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: 500;
    transition: all var(--transition-base);
}

.btn-edit {
    background-color: var(--color-card);
    border: 2px solid var(--color-accent);
    color: var(--color-accent);
}

.btn-edit:hover {
    background-color: var(--color-accent);
    color: white;
}

.btn-delete {
    background-color: var(--color-card);
    border: 2px solid var(--color-error);
    color: var(--color-error);
}

.btn-delete:hover {
    background-color: var(--color-error);
    color: white;
}

/* Post Content */
.post-content {
    padding: var(--spacing-2xl);
    line-height: 1.8;
    color: var(--color-text);
}

/* Post Footer */
.post-footer {
    padding: var(--spacing-xl) var(--spacing-2xl);
    background: var(--color-bg-secondary);
    border-top: 1px solid var(--color-border-light);
}

.btn-back {
    background-color: var(--color-card);
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
    padding: var(--spacing-sm) var(--spacing-xl);
    border-radius: var(--radius-md);
    font-weight: 500;
    transition: all var(--transition-base);
}

.btn-back:hover {
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
    border-color: var(--color-accent);
    color: white;
    transform: translateX(-4px);
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .post-header {
        padding: var(--spacing-lg);
    }

    .post-title {
        font-size: var(--font-size-2xl);
    }

    .post-content {
        padding: var(--spacing-lg);
    }

    .post-footer {
        padding: var(--spacing-md) var(--spacing-lg);
    }

    .post-meta {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>