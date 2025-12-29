<template>
    <div class="sitemap-generator">
        <h3>🗺️ Sitemap 생성기</h3>
        <p class="description">
            블로그의 모든 페이지와 포스트를 포함한 sitemap.xml을 생성합니다.
        </p>

        <div class="stats" v-if="posts.length > 0">
            <div class="stat-item">
                <span class="label">총 포스트:</span>
                <span class="value">{{ posts.length }}개</span>
            </div>
            <div class="stat-item">
                <span class="label">정적 페이지:</span>
                <span class="value">4개</span>
            </div>
            <div class="stat-item">
                <span class="label">총 URL:</span>
                <span class="value">{{ posts.length + 4 }}개</span>
            </div>
        </div>

        <div class="actions">
            <button
                type="button"
                class="btn btn-primary"
                @click="generateAndDownload"
                :disabled="loading">
                <span v-if="loading">생성 중...</span>
                <span v-else>📥 Sitemap 다운로드</span>
            </button>

            <button
                type="button"
                class="btn btn-secondary"
                @click="generateRobots"
                :disabled="loading">
                📄 robots.txt 다운로드
            </button>
        </div>

        <div class="preview" v-if="sitemapPreview">
            <h4>미리보기 (처음 10줄)</h4>
            <pre>{{ sitemapPreview }}</pre>
        </div>

        <div class="instructions">
            <h4>📌 사용 방법</h4>
            <ol>
                <li>위 버튼을 클릭하여 sitemap.xml 파일을 다운로드합니다</li>
                <li>다운로드한 파일을 <code>/public</code> 폴더에 덮어씁니다</li>
                <li>배포 후 Google Search Console에서 sitemap을 제출합니다</li>
                <li>URL: <code>https://yllee.pe.kr/sitemap.xml</code></li>
            </ol>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDocuments } from '../../firebase/firebase-app.js'
import { generateSitemapXml, downloadSitemap, generateRobotsTxt } from '../../utils/sitemap-generator.js'
import Constant from '../../constant.js'
import { useToast } from 'vue-toastification'
import logger from '../../utils/logger.js'

const toast = useToast()
const posts = ref([])
const loading = ref(false)
const sitemapPreview = ref('')

onMounted(async () => {
    try {
        loading.value = true
        posts.value = await getDocuments(Constant.BOARD_INFO)
        logger.info('Loaded posts for sitemap:', posts.value.length)
    } catch (error) {
        logger.error('Failed to load posts:', error)
        toast.error('포스트 목록을 불러올 수 없습니다.')
    } finally {
        loading.value = false
    }
})

const generateAndDownload = () => {
    try {
        loading.value = true

        const xmlContent = generateSitemapXml(posts.value)

        // Show preview
        const lines = xmlContent.split('\n')
        sitemapPreview.value = lines.slice(0, 15).join('\n') + '\n...'

        // Download
        downloadSitemap(xmlContent)

        toast.success(`Sitemap 생성 완료! (${posts.value.length + 4}개 URL)`)
        logger.info('Sitemap generated and downloaded')
    } catch (error) {
        logger.error('Failed to generate sitemap:', error)
        toast.error('Sitemap 생성에 실패했습니다.')
    } finally {
        loading.value = false
    }
}

const generateRobots = () => {
    try {
        const robotsContent = generateRobotsTxt()

        const blob = new Blob([robotsContent], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'robots.txt'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast.success('robots.txt 다운로드 완료!')
        logger.info('robots.txt downloaded')
    } catch (error) {
        logger.error('Failed to generate robots.txt:', error)
        toast.error('robots.txt 생성에 실패했습니다.')
    }
}
</script>

<style scoped>
.sitemap-generator {
    background: var(--color-card);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-md);
    margin: var(--spacing-xl) 0;
}

h3 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-2xl);
}

.description {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xl);
}

.stats {
    display: flex;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
    padding: var(--spacing-lg);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
}

.stat-item {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.stat-item .label {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
}

.stat-item .value {
    font-size: var(--font-size-xl);
    font-weight: 700;
    color: var(--color-accent);
}

.actions {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
}

.btn {
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--radius-md);
    font-weight: 500;
    transition: all var(--transition-base);
    cursor: pointer;
}

.btn-primary {
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
    color: white;
    border: none;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.btn-secondary {
    background: var(--color-card);
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
}

.btn-secondary:hover:not(:disabled) {
    background: var(--color-primary);
    color: white;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.preview {
    margin-bottom: var(--spacing-xl);
    padding: var(--spacing-lg);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    border-left: 4px solid var(--color-accent);
}

.preview h4 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
    font-size: var(--font-size-lg);
}

.preview pre {
    font-family: 'Courier New', monospace;
    font-size: var(--font-size-sm);
    color: var(--color-text);
    overflow-x: auto;
    white-space: pre-wrap;
    margin: 0;
}

.instructions {
    padding: var(--spacing-lg);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
}

.instructions h4 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-lg);
}

.instructions ol {
    margin-left: var(--spacing-lg);
    color: var(--color-text-secondary);
}

.instructions li {
    margin-bottom: var(--spacing-sm);
    line-height: 1.6;
}

.instructions code {
    background: var(--color-card);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    font-family: 'Courier New', monospace;
    font-size: var(--font-size-sm);
    color: var(--color-accent);
}

@media (max-width: 768px) {
    .stats {
        flex-direction: column;
    }

    .actions {
        flex-direction: column;
    }

    .btn {
        width: 100%;
    }
}
</style>
