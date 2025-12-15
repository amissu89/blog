<template>
    <footer class="footer">
        <div class="footer-content">
            <p class="copyright">
                &copy; 2025 Rocky. All Rights Reserved.
            </p>
            <p class="made-with">
                Made with <span class="heart">❤️</span> using Vue.js
            </p>
        </div>
    </footer>
</template>

<script>
export default {

}
</script>

<style scoped>
.footer {
    background: linear-gradient(to bottom, var(--color-card), var(--color-bg-secondary));
    border-top: 2px solid var(--color-border-light);
    margin-top: var(--spacing-3xl);
    padding: var(--spacing-lg) var(--spacing-md);
}

.footer-content {
    max-width: 960px;
    margin: 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.copyright,
.made-with {
    font-size: var(--font-size-sm);
    color: var(--color-text-tertiary);
    margin: 0;
}

.heart {
    color: var(--color-accent);
    animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .footer {
        padding: var(--spacing-md) var(--spacing-sm);
    }
}
</style>