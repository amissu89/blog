import { watch } from 'vue'

/**
 * SEO composable for managing meta tags dynamically
 * @param {Object} options - SEO options
 * @param {string} options.title - Page title
 * @param {string} options.description - Page description
 * @param {string} options.image - OG image URL
 * @param {string} options.url - Canonical URL
 * @param {string} options.type - OG type (website, article, etc.)
 */
export function useSeo(options = {}) {

    const defaultSeo = {
        title: "Rocky's Blog",
        description: "Rocky의 일하는 이야기",
        image: "https://yllee.pe.kr/thumbnail.png",
        url: "https://yllee.pe.kr",
        type: "website",
        siteName: "Rocky's Blog",
        locale: "ko_KR"
    }

    const updateMetaTags = (seoData) => {
        const {
            title,
            description,
            image,
            url,
            type,
            siteName,
            locale
        } = { ...defaultSeo, ...seoData }

        // Update document title
        document.title = title === defaultSeo.title ? title : `${title} | ${defaultSeo.title}`

        // Update or create meta tags
        updateMetaTag('name', 'description', description)
        updateMetaTag('property', 'og:title', title)
        updateMetaTag('property', 'og:description', description)
        updateMetaTag('property', 'og:image', image)
        updateMetaTag('property', 'og:url', url)
        updateMetaTag('property', 'og:type', type)
        updateMetaTag('property', 'og:site_name', siteName)
        updateMetaTag('property', 'og:locale', locale)

        // Twitter Card tags
        updateMetaTag('name', 'twitter:card', 'summary_large_image')
        updateMetaTag('name', 'twitter:title', title)
        updateMetaTag('name', 'twitter:description', description)
        updateMetaTag('name', 'twitter:image', image)

        // Update canonical link
        updateCanonicalLink(url)
    }

    const updateMetaTag = (attribute, key, content) => {
        let element = document.querySelector(`meta[${attribute}="${key}"]`)

        if (!element) {
            element = document.createElement('meta')
            element.setAttribute(attribute, key)
            document.head.appendChild(element)
        }

        element.setAttribute('content', content)
    }

    const updateCanonicalLink = (url) => {
        let link = document.querySelector('link[rel="canonical"]')

        if (!link) {
            link = document.createElement('link')
            link.setAttribute('rel', 'canonical')
            document.head.appendChild(link)
        }

        link.setAttribute('href', url)
    }

    // Initial update
    updateMetaTags(options)

    // Watch for option changes
    watch(() => options, (newOptions) => {
        updateMetaTags(newOptions)
    }, { deep: true })

    return {
        updateSeo: updateMetaTags
    }
}

/**
 * Generate structured data (JSON-LD) for blog posts
 * @param {Object} post - Post data
 * @param {string} post.title - Post title
 * @param {string} post.content - Post content (for excerpt)
 * @param {string} post.createDt - Creation date
 * @param {string} post.category - Post category
 * @param {string} post.id - Post ID
 * @returns {Object} JSON-LD structured data
 */
export function generateBlogPostStructuredData(post) {
    const baseUrl = 'https://yllee.pe.kr'

    // Extract plain text from markdown content for excerpt
    const getExcerpt = (content, maxLength = 160) => {
        const plainText = content
            .replace(/[#*`_~]/g, '') // Remove markdown symbols
            .replace(/\n/g, ' ')      // Replace newlines with spaces
            .trim()
        return plainText.length > maxLength
            ? plainText.substring(0, maxLength) + '...'
            : plainText
    }

    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': post.title,
        'description': post.summary || getExcerpt(post.content || ''),
        'author': {
            '@type': 'Person',
            'name': 'Rocky Lee',
            'url': baseUrl
        },
        'datePublished': post.createDt,
        'dateModified': post.updateDt || post.createDt,
        'publisher': {
            '@type': 'Organization',
            'name': "Rocky's Blog",
            'logo': {
                '@type': 'ImageObject',
                'url': `${baseUrl}/logo.png`
            }
        },
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': `${baseUrl}/view/${post.id}`
        },
        'articleSection': post.category,
        'url': `${baseUrl}/view/${post.id}`
    }
}

/**
 * Inject structured data script into document head
 * @param {Object} structuredData - JSON-LD data
 */
export function injectStructuredData(structuredData) {
    // Remove existing structured data
    const existing = document.querySelector('script[type="application/ld+json"]')
    if (existing) {
        existing.remove()
    }

    // Create and inject new structured data
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(structuredData, null, 2)
    document.head.appendChild(script)
}
