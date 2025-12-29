/**
 * Generate sitemap.xml content from posts data
 * @param {Array} posts - Array of post objects with id and createDt
 * @returns {string} XML string for sitemap
 */
export function generateSitemapXml(posts) {
    const baseUrl = 'https://yllee.pe.kr'

    // Static pages
    const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'daily' },
        { url: '/about', priority: '0.8', changefreq: 'monthly' },
        { url: '/posts', priority: '0.9', changefreq: 'daily' },
        { url: '/work', priority: '0.7', changefreq: 'monthly' }
    ]

    // Format date to YYYY-MM-DD
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
    }

    // Generate XML for static pages
    const staticPagesXml = staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')

    // Generate XML for blog posts
    const postsXml = posts.map(post => `
  <url>
    <loc>${baseUrl}/view/${post.id}</loc>
    <lastmod>${formatDate(post.createDt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')

    // Complete sitemap XML
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">${staticPagesXml}${postsXml}
</urlset>`

    return sitemapXml
}

/**
 * Download sitemap as XML file
 * @param {string} xmlContent - XML content
 */
export function downloadSitemap(xmlContent) {
    const blob = new Blob([xmlContent], { type: 'application/xml' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'sitemap.xml'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}

/**
 * Generate robots.txt content
 * @returns {string} robots.txt content
 */
export function generateRobotsTxt() {
    const baseUrl = 'https://yllee.pe.kr'

    return `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Disallow: /posting
Disallow: /edit/

Sitemap: ${baseUrl}/sitemap.xml
`
}
