<template>
    <div class="container">
        <h2 class="section-title">Recent Posts</h2>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading posts...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="recentPosts.length === 0" class="empty-state">
            <h3>No posts yet</h3>
            <p>Check back soon for new content!</p>
        </div>

        <!-- Post List -->
        <div v-else class="post-list">
            <div
                v-for="post in recentPosts"
                :key="post.id"
                class="post-card"
                @click="goToPost(post.id)"
            >
                <div class="post-thumbnail">
                    <img :src="post.thumbnail || defaultThumbnail" :alt="post.title" />
                </div>
                <div class="post-info">
                    <h3 class="post-title">{{ post.title }}</h3>
                    <p class="post-excerpt">{{ post.excerpt }}</p>
                    <span class="post-date">{{ post.date }}</span>
                </div>
            </div>
        </div>

        <!-- View All Button -->
        <div v-if="recentPosts.length > 0" class="view-all">
            <button class="btn btn-view-all" @click="$router.push('/posts')">
                전체 글 보기 →
            </button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCollection, getDocumentsByQuery, getDocument } from '../firebase/firebase-app.js'
import { buildQueryWithOrdering } from '../firebase/firebase-app.js'
import Constant from '../constant.js'
import { formatterForDatetime } from '../utility.js'
import logger from '../utils/logger.js'

const router = useRouter()
const recentPosts = ref([])
const loading = ref(true)
const defaultThumbnail = '/thumbnail.png'

const RECENT_POST_COUNT = 5
const EXCERPT_LENGTH = 30

function stripHtml(html) {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
}

function getExcerpt(content, maxLength) {
    const plainText = stripHtml(content).trim()
    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength) + '.....'
}

onMounted(async () => {
    try {
        const collectionRef = getCollection(Constant.BOARD_INFO)
        const q = buildQueryWithOrdering(collectionRef, 'createDt', Constant.DESC)
        const querySnapshot = await getDocumentsByQuery(q)

        const posts = []
        querySnapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() })
        })

        // 최근 5개만
        const recent = posts.slice(0, RECENT_POST_COUNT)

        // 각 게시글의 content에서 썸네일과 본문 도입부 가져오기
        const postPromises = recent.map(async (post) => {
            let thumbnail = null
            let excerpt = post.summary || ''

            try {
                const contentDoc = await getDocument(Constant.BOARD_CONTENT, post.id)
                if (contentDoc.exists()) {
                    const contentData = contentDoc.data()
                    if (contentData.imageUrls && contentData.imageUrls.length > 0) {
                        thumbnail = contentData.imageUrls[0]
                    }
                    if (contentData.content) {
                        excerpt = getExcerpt(contentData.content, EXCERPT_LENGTH)
                    }
                }
            } catch (e) {
                logger.error('Failed to fetch post content:', e)
            }

            return {
                id: post.id,
                title: post.title,
                thumbnail,
                excerpt,
                date: formatterForDatetime(new Date(post.createDt)),
            }
        })

        recentPosts.value = await Promise.all(postPromises)
    } catch (error) {
        logger.error('Failed to fetch recent posts:', error)
    } finally {
        loading.value = false
    }
})

const goToPost = (postId) => {
    router.push({ name: 'viewer', params: { id: postId } })
}
</script>

<style scoped>
.section-title {
    text-align: center;
    font-size: var(--font-size-2xl);
    font-weight: 600;
    color: var(--color-primary);
    margin-bottom: var(--spacing-2xl);
}

/* Loading */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-3xl);
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

/* Empty */
.empty-state {
    text-align: center;
    padding: var(--spacing-3xl);
}

.empty-state h3 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
}

.empty-state p {
    color: var(--color-text-secondary);
}

/* Post List */
.post-list {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

/* Post Card */
.post-card {
    display: flex;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    background-color: var(--color-card);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    transition: all var(--transition-base);
}

.post-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-hover);
    border-color: var(--color-accent-light);
}

/* Thumbnail */
.post-thumbnail {
    flex-shrink: 0;
    width: 120px;
    height: 90px;
    border-radius: var(--radius-md);
    overflow: hidden;
    background-color: var(--color-bg-secondary);
}

.post-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Post Info */
.post-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
}

.post-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 var(--spacing-xs) 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.post-excerpt {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin: 0 0 var(--spacing-xs) 0;
    line-height: 1.5;
}

.post-date {
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
}

/* View All */
.view-all {
    text-align: center;
    margin-top: var(--spacing-2xl);
}

.btn-view-all {
    padding: var(--spacing-sm) var(--spacing-2xl);
    border: 2px solid var(--color-accent);
    background: transparent;
    color: var(--color-accent);
    border-radius: var(--radius-md);
    font-size: var(--font-size-base);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-base);
}

.btn-view-all:hover {
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
    color: white;
    transform: translateY(-2px);
}

/* Mobile */
@media (max-width: 768px) {
    .post-card {
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .post-thumbnail {
        width: 100%;
        height: 180px;
    }

    .post-title {
        white-space: normal;
    }
}
</style>
