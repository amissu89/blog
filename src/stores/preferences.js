import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import logger from '../utils/logger.js';

export const usePreferencesStore = defineStore('preferences', () => {
    // Default preferences
    const defaultPreferences = {
        theme: 'light', // 'light' | 'dark'
        language: 'en', // 'en' | 'ko'
        postsPerPage: 10,
        editorMode: 'wysiwyg', // 'wysiwyg' | 'markdown'
        notifications: {
            email: true,
            push: false,
        },
        autoSaveDrafts: true,
        autoSaveInterval: 30000, // 30 seconds
    };

    // Load preferences from localStorage
    const loadPreferences = () => {
        try {
            const stored = localStorage.getItem('userPreferences');
            if (stored) {
                return { ...defaultPreferences, ...JSON.parse(stored) };
            }
        } catch (error) {
            logger.error('Failed to load preferences:', error);
        }
        return defaultPreferences;
    };

    // state
    const preferences = ref(loadPreferences());

    // Save preferences to localStorage whenever they change
    watch(
        preferences,
        (newPreferences) => {
            try {
                localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
            } catch (error) {
                logger.error('Failed to save preferences:', error);
            }
        },
        { deep: true }
    );

    // actions
    function setTheme(theme) {
        if (['light', 'dark'].includes(theme)) {
            preferences.value.theme = theme;
        }
    }

    function setLanguage(language) {
        preferences.value.language = language;
    }

    function setPostsPerPage(count) {
        if (typeof count === 'number' && count > 0) {
            preferences.value.postsPerPage = count;
        }
    }

    function setEditorMode(mode) {
        if (['wysiwyg', 'markdown'].includes(mode)) {
            preferences.value.editorMode = mode;
        }
    }

    function setNotifications(notifications) {
        preferences.value.notifications = {
            ...preferences.value.notifications,
            ...notifications,
        };
    }

    function setAutoSaveDrafts(enabled) {
        preferences.value.autoSaveDrafts = enabled;
    }

    function setAutoSaveInterval(interval) {
        if (typeof interval === 'number' && interval > 0) {
            preferences.value.autoSaveInterval = interval;
        }
    }

    function updatePreference(key, value) {
        if (key in preferences.value) {
            preferences.value[key] = value;
        }
    }

    function resetPreferences() {
        preferences.value = { ...defaultPreferences };
    }

    function resetToDefault(key) {
        if (key in defaultPreferences) {
            preferences.value[key] = defaultPreferences[key];
        }
    }

    return {
        preferences,
        setTheme,
        setLanguage,
        setPostsPerPage,
        setEditorMode,
        setNotifications,
        setAutoSaveDrafts,
        setAutoSaveInterval,
        updatePreference,
        resetPreferences,
        resetToDefault,
    };
});
