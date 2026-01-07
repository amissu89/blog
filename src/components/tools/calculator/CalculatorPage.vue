<template>
    <div class="calculator-page container">
        <div class="page-header">
            <router-link to="/tools" class="back-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                </svg>
                Back to Tools
            </router-link>
            <h1>Calculator</h1>
            <p class="subtitle">Financial calculation tools</p>
        </div>

        <div class="calculators-grid">
            <router-link to="/tools/calculator/mortgage" class="calculator-card">
                <div class="calculator-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"/>
                    </svg>
                </div>
                <h3>Mortgage Calculator</h3>
                <p>Calculate mortgage payments and compare different repayment methods</p>
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
    title: 'Calculator | Rocky\'s Blog',
    meta: [
        {
            name: 'description',
            content: 'Financial calculation tools'
        }
    ]
})
</script>

<style scoped>
.calculator-page {
    padding: var(--spacing-2xl) var(--spacing-md);
    max-width: 1200px;
    margin: 0 auto;
}

.page-header {
    text-align: center;
    margin-bottom: var(--spacing-2xl);
}

.back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--color-text-secondary);
    text-decoration: none;
    font-size: var(--font-size-base);
    margin-bottom: var(--spacing-lg);
    transition: color var(--transition-base);
}

.back-link:hover {
    color: var(--color-accent);
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

.calculators-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-xl);
    margin-top: var(--spacing-2xl);
}

.calculator-card {
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

.calculator-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-accent);
}

.calculator-icon {
    color: var(--color-accent);
    margin-bottom: var(--spacing-lg);
}

.calculator-card h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
}

.calculator-card p {
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    margin: 0;
}

@media (max-width: 768px) {
    .calculator-page {
        padding: var(--spacing-xl) var(--spacing-sm);
    }

    .page-header h1 {
        font-size: var(--font-size-3xl);
    }

    .calculators-grid {
        grid-template-columns: 1fr;
    }
}
</style>
