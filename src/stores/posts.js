import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getDocuments, getDocument } from '../firebase/firebase-app.js';
import logger from '../utils/logger.js';

export const usePostsStore = defineStore('posts', () => {
    // state
    const posts = ref([]);
    const cachedPosts = ref(new Map()); // Map<postId, postData>
    const lastFetchTime = ref(null);
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    // actions
    async function fetchPosts(forceRefresh = false) {
        const now = Date.now();
        const cacheValid = lastFetchTime.value && (now - lastFetchTime.value) < CACHE_DURATION;

        if (!forceRefresh && cacheValid && posts.value.length > 0) {
            return posts.value;
        }

        try {
            const fetchedPosts = await getDocuments('posts');
            posts.value = fetchedPosts;
            lastFetchTime.value = now;

            // Update cache map
            fetchedPosts.forEach(post => {
                cachedPosts.value.set(post.id, post);
            });

            return posts.value;
        } catch (error) {
            logger.error('Failed to fetch posts:', error);
            throw error;
        }
    }

    async function fetchPostById(postId, forceRefresh = false) {
        // Check cache first
        if (!forceRefresh && cachedPosts.value.has(postId)) {
            return cachedPosts.value.get(postId);
        }

        try {
            const post = await getDocument('posts', postId);
            if (post) {
                cachedPosts.value.set(postId, post);
            }
            return post;
        } catch (error) {
            logger.error(`Failed to fetch post ${postId}:`, error);
            throw error;
        }
    }

    function addPost(post) {
        if (!post || !post.id) return;

        posts.value.unshift(post); // Add to beginning
        cachedPosts.value.set(post.id, post);
    }

    function updatePost(postId, updatedPost) {
        if (!postId) return;

        const index = posts.value.findIndex(p => p.id === postId);
        if (index !== -1) {
            posts.value[index] = { ...posts.value[index], ...updatedPost };
        }

        if (cachedPosts.value.has(postId)) {
            cachedPosts.value.set(postId, { ...cachedPosts.value.get(postId), ...updatedPost });
        }
    }

    function deletePost(postId) {
        if (!postId) return;

        posts.value = posts.value.filter(p => p.id !== postId);
        cachedPosts.value.delete(postId);
    }

    function clearCache() {
        posts.value = [];
        cachedPosts.value.clear();
        lastFetchTime.value = null;
    }

    function getCachedPost(postId) {
        return cachedPosts.value.get(postId);
    }

    return {
        posts,
        fetchPosts,
        fetchPostById,
        addPost,
        updatePost,
        deletePost,
        clearCache,
        getCachedPost,
    };
});
