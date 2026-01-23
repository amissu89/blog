<template>
    <div class="container">
        <!-- Filter Buttons -->
        <div class="filter-buttons">
            <button
                v-for="filter in filters"
                :key="filter.value"
                class="btn btn-filter"
                :class="{ active: activeFilter === filter.value }"
                @click="setFilter(filter.value)">
                {{ filter.label }}
            </button>
        </div>

        <!-- Search Box -->
        <div class="search-box">
            <input
                type="text"
                class="search-input"
                v-model="searchQuery"
                placeholder="제목 또는 내용으로 검색..."
                @input="onSearchInput"
            />
            <button v-if="searchQuery" class="search-clear" @click="clearSearch">
                ✕
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading posts...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="rows.length === 0" class="empty-state">
            <div class="empty-icon">📝</div>
            <h3>No posts yet</h3>
            <p>Check back soon for new content!</p>
        </div>

        <!-- Posts Table -->
        <div v-else>
            <table class="table">
                <tbody>
                    <tr v-for="(row, index) in paginatedRows" :key="row.id || index">
                        <th scope="row" style="display: none;">{{ row.id }}</th>
                        <td class="category-cell"> [ {{ row.category }} ] </td>
                        <td @click="loadPost(row.id)"> {{ row.title }}</td>
                        <td style="text-align:right;"> {{ row.createDt }}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination Controls -->
            <div v-if="totalPages > 1" class="pagination-controls">
                <button
                    class="btn btn-pagination"
                    :disabled="currentPage === 1"
                    @click="goToPage(currentPage - 1)">
                    ← Previous
                </button>

                <div class="page-numbers">
                    <button
                        v-for="page in visiblePages"
                        :key="page"
                        class="btn btn-page-number"
                        :class="{ active: page === currentPage }"
                        @click="goToPage(page)">
                        {{ page }}
                    </button>
                </div>

                <button
                    class="btn btn-pagination"
                    :disabled="currentPage === totalPages"
                    @click="goToPage(currentPage + 1)">
                    Next →
                </button>
            </div>

            <!-- Pagination Info -->
            <div class="pagination-info">
                <small>Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ filteredRows.length }} posts</small>
            </div>
        </div>
    </div>
</template>

<script setup>

import { onMounted, ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCollection, getDocumentsByOrdering, getDocumentsByQuery } from '../../firebase/firebase-app.js'
import Constant from '../../constant.js'
import { formatterForDatetime } from '../../utility.js'
import logger from '../../utils/logger.js'

const rows = ref([])
const loading = ref(true)
const currentPage = ref(1)
const activeFilter = ref('all')
const searchQuery = ref('')
const router = useRouter()
const route = useRoute()

const ITEMS_PER_PAGE = Constant.ITEMS_PER_PAGE

// Filter options
const filters = [
    { label: 'All', value: 'all' },
    { label: 'Daily', value: 'daily' },
    { label: 'Work', value: 'work' },
    { label: 'Study', value: 'study' },
]

// Filtered rows based on active filter and search query
const filteredRows = computed(() => {
    let result = rows.value

    // Filter by category
    if (activeFilter.value !== 'all') {
        result = result.filter(row => row.category === activeFilter.value)
    }

    // Filter by search query
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim()
        result = result.filter(row =>
            row.title?.toLowerCase().includes(query) ||
            row.summary?.toLowerCase().includes(query)
        )
    }

    return result
})

// Computed properties for pagination
const totalPages = computed(() => Math.ceil(filteredRows.value.length / ITEMS_PER_PAGE))

const startIndex = computed(() => (currentPage.value - 1) * ITEMS_PER_PAGE)

const endIndex = computed(() => {
    const end = startIndex.value + ITEMS_PER_PAGE
    return end > filteredRows.value.length ? filteredRows.value.length : end
})

const paginatedRows = computed(() => {
    return filteredRows.value.slice(startIndex.value, endIndex.value)
})

// Show max 5 page numbers at a time
const visiblePages = computed(() => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    // Adjust start if we're near the end
    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    return pages
})

// Initialize page from URL query parameter
onMounted(async () => {
    // Load page from URL if exists
    const pageFromUrl = parseInt(route.query.page)
    if (pageFromUrl && pageFromUrl > 0) {
        currentPage.value = pageFromUrl
    }

    await fetchItems()
})

// Update URL when page changes
watch(currentPage, (newPage) => {
    router.push({ query: { ...route.query, page: newPage } })
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
})

const fetchItems = async () => {
    try {
        const collection = getCollection(Constant.BOARD_INFO)
        const q = getDocumentsByOrdering(collection, "createDt", Constant.DESC)
        const querySnapshot = await getDocumentsByQuery(q);

        querySnapshot.forEach((doc) => {
            let obj = doc.data();
            obj.id = doc.id;
            obj.createDt = formatterForDatetime(new Date(obj.createDt))
            rows.value.push(obj);
        })
    } catch (error) {
        logger.error('Failed to fetch posts:', error)
    } finally {
        loading.value = false
    }
}

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

const setFilter = (filter) => {
    activeFilter.value = filter
    currentPage.value = 1 // Reset to first page when filter changes
}

const onSearchInput = () => {
    currentPage.value = 1 // Reset to first page when search changes
}

const clearSearch = () => {
    searchQuery.value = ''
    currentPage.value = 1
}

const loadPost = (postId) => {
    router.push({
        name: 'viewer',
        params: {
            id: postId
        }
    })
}


</script>



<style scoped>
/* Filter Buttons */
.filter-buttons {
    display: flex;
    justify-content: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xl);
    flex-wrap: wrap;
}

.btn-filter {
    padding: var(--spacing-sm) var(--spacing-lg);
    border: 2px solid var(--color-border);
    background: var(--color-card);
    color: var(--color-text);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-base);
}

.btn-filter:hover {
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
    border-color: var(--color-accent);
    color: white;
    transform: translateY(-2px);
}

.btn-filter.active {
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
    border-color: var(--color-accent);
    color: white;
}

/* Search Box */
.search-box {
    position: relative;
    max-width: 400px;
    margin: 0 auto var(--spacing-xl);
}

.search-input {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-lg);
    padding-right: var(--spacing-2xl);
    border: 2px solid var(--color-border);
    background: var(--color-card);
    color: var(--color-text);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    transition: all var(--transition-base);
}

.search-input:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(var(--color-accent-rgb, 139, 90, 43), 0.1);
}

.search-input::placeholder {
    color: var(--color-text-tertiary);
}

.search-clear {
    position: absolute;
    right: var(--spacing-sm);
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: var(--spacing-xs);
    font-size: var(--font-size-sm);
    line-height: 1;
    transition: color var(--transition-base);
}

.search-clear:hover {
    color: var(--color-accent);
}

/* Loading State */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-3xl) var(--spacing-lg);
    min-height: 300px;
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
    font-size: var(--font-size-base);
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: var(--spacing-3xl) var(--spacing-lg);
    background: var(--color-card);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    margin: var(--spacing-xl) 0;
}

.empty-icon {
    font-size: 4rem;
    margin-bottom: var(--spacing-lg);
    opacity: 0.5;
}

.empty-state h3 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
    font-size: var(--font-size-2xl);
}

.empty-state p {
    color: var(--color-text-secondary);
    font-size: var(--font-size-base);
}

/* Table Styling */
.table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 var(--spacing-md);
}

.table tr {
    background-color: var(--color-card);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-base);
}

.table td {
    padding: var(--spacing-md) var(--spacing-lg);
    vertical-align: middle;
    color: var(--color-text);
    border: none;
    background-color: var(--color-card);
}

.table td:nth-child(2) {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-text-secondary);
    width: 120px;
    border-top-left-radius: var(--radius-md);
    border-bottom-left-radius: var(--radius-md);
}

.table td:nth-child(3) {
    font-size: var(--font-size-base);
    font-weight: 500;
    cursor: pointer;
}

.table td:last-child {
    font-size: var(--font-size-sm);
    color: var(--color-text-tertiary);
    text-align: right;
    white-space: nowrap;
    border-top-right-radius: var(--radius-md);
    border-bottom-right-radius: var(--radius-md);
}

/* Warm Hover Effect */
.table tr:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-hover);
    cursor: pointer;
}

.table tr:hover td {
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
    color: #ffffff;
}

.table tr:hover td:nth-child(2),
.table tr:hover td:last-child {
    color: rgba(255, 255, 255, 0.9);
}

/* Pagination Controls */
.pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-md);
    margin-top: var(--spacing-2xl);
    margin-bottom: var(--spacing-lg);
}

.page-numbers {
    display: flex;
    gap: var(--spacing-xs);
}

.btn-pagination,
.btn-page-number {
    padding: var(--spacing-sm) var(--spacing-md);
    border: 2px solid var(--color-border);
    background: var(--color-card);
    color: var(--color-text);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-base);
}

.btn-pagination:hover:not(:disabled),
.btn-page-number:hover {
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
    border-color: var(--color-accent);
    color: white;
    transform: translateY(-2px);
}

.btn-pagination:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-page-number.active {
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
    border-color: var(--color-accent);
    color: white;
}

.pagination-info {
    text-align: center;
    margin-bottom: var(--spacing-xl);
    color: var(--color-text-secondary);
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .table td {
        font-size: var(--font-size-sm);
        padding: var(--spacing-sm) var(--spacing-md);
    }

    .table td:first-child {
        width: 90px;
    }

    .category-cell {
        display: none;
    }

    .table td:nth-child(3) {
        border-top-left-radius: var(--radius-md);
        border-bottom-left-radius: var(--radius-md);
    }

    .empty-state {
        padding: var(--spacing-2xl) var(--spacing-md);
    }

    .empty-icon {
        font-size: 3rem;
    }

    .pagination-controls {
        flex-wrap: wrap;
        gap: var(--spacing-sm);
    }

    .btn-pagination,
    .btn-page-number {
        padding: var(--spacing-xs) var(--spacing-sm);
        font-size: var(--font-size-xs);
    }

    .filter-buttons {
        gap: var(--spacing-xs);
    }

    .btn-filter {
        padding: var(--spacing-xs) var(--spacing-md);
        font-size: var(--font-size-xs);
    }

    .search-box {
        max-width: 100%;
    }

    .search-input {
        font-size: var(--font-size-xs);
    }
}
</style>