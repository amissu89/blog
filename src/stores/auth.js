import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { observeAuthState, logout as firebaseLogout } from '../firebase/firebase-app.js';

export const useAuthStore = defineStore('auth', () => {
    // state
    const user = ref(null);
    const loading = ref(true);

    // getters (computed properties)
    const isAuthenticated = computed(() => !!user.value);
    const isAdmin = computed(() => {
        if (!user.value) return false;
        // This is a temporary admin check. A better approach is to use custom claims in Firebase Auth.
        return user.value.email === 'ylleel@gmail.com';
    });

    // actions
    function listenForAuthStateChange() {
        observeAuthState(u => {
            user.value = u;
            loading.value = false;
        });
    }

    async function logout() {
        try {
            await firebaseLogout();
            // The user ref will be automatically updated to null by the observeAuthState listener
        } catch (error) {
            console.error("Logout failed:", error);
            throw error; // Re-throw the error so the component can handle it (e.g., show a toast)
        }
    }

    // Initialize the auth state listener when the store is first created
    listenForAuthStateChange();

    return {
        user,
        loading,
        isAuthenticated,
        isAdmin,
        logout,
    };
});
