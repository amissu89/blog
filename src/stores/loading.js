import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useLoadingStore = defineStore('loading', () => {
    // state - Track multiple loading states by key
    const loadingStates = ref(new Map());

    // getters
    const isLoading = computed(() => {
        return Array.from(loadingStates.value.values()).some(state => state === true);
    });

    const getLoadingState = (key) => {
        return loadingStates.value.get(key) || false;
    };

    // actions
    function startLoading(key) {
        loadingStates.value.set(key, true);
    }

    function stopLoading(key) {
        loadingStates.value.set(key, false);
    }

    function toggleLoading(key) {
        const currentState = loadingStates.value.get(key) || false;
        loadingStates.value.set(key, !currentState);
    }

    function clearLoading(key) {
        loadingStates.value.delete(key);
    }

    function clearAllLoading() {
        loadingStates.value.clear();
    }

    // Helper function to wrap async operations with loading state
    async function withLoading(key, asyncFn) {
        try {
            startLoading(key);
            const result = await asyncFn();
            return result;
        } catch (error) {
            throw error;
        } finally {
            stopLoading(key);
        }
    }

    return {
        loadingStates,
        isLoading,
        getLoadingState,
        startLoading,
        stopLoading,
        toggleLoading,
        clearLoading,
        clearAllLoading,
        withLoading,
    };
});
