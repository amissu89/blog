<template>
    <div class="tools-page container">
        <div class="page-header">
            <h1>Tools</h1>
            <p class="subtitle">Useful calculators and utilities</p>
        </div>

        <div class="tools-grid">
            <router-link to="/tools/calculator" class="tool-card">
                <div class="tool-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z"/>
                        <path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-4z"/>
                    </svg>
                </div>
                <h3>Calculator</h3>
                <p>Financial calculators and tools</p>
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
    title: 'Tools | Rocky\'s Blog',
    meta: [
        {
            name: 'description',
            content: 'Useful calculators and utilities'
        }
    ]
})
</script>

<style scoped>
.tools-page {
    padding: var(--spacing-2xl) var(--spacing-md);
    max-width: 1200px;
    margin: 0 auto;
}

.page-header {
    text-align: center;
    margin-bottom: var(--spacing-2xl);
}

.page-header h1 {
    font-size: var(--font-size-4xl);
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
}

.subtitle {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
}

.tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-xl);
    margin-top: var(--spacing-2xl);
}

.tool-card {
    background: var(--color-bg);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    text-decoration: none;
    color: var(--color-text);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-base);
    border: 1px solid var(--color-border);
    text-align: center;
}

.tool-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-accent);
}

.tool-icon {
    color: var(--color-accent);
    margin-bottom: var(--spacing-lg);
}

.tool-card h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
}

.tool-card p {
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    margin: 0;
}

@media (max-width: 768px) {
    .tools-page {
        padding: var(--spacing-xl) var(--spacing-sm);
    }

    .page-header h1 {
        font-size: var(--font-size-3xl);
    }

    .tools-grid {
        grid-template-columns: 1fr;
    }
}
</style>
