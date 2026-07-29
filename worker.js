/**
 * WasherLab Cloudflare Worker
 * Handles API routes; static files served by Cloudflare Assets
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Only handle API routes, let Cloudflare Assets serve static files
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env, url);
    }
    
    // Pass through to Assets for static files
    return fetch(request);
  },
};

async function handleApiRequest(request, env, url) {
  // Health check
  if (url.pathname === '/api/health') {
    return new Response(JSON.stringify({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      worker: 'WasherLab'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Sitemap API
  if (url.pathname === '/api/sitemap.xml') {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://washerlab.top/</loc>
    <lastmod>2026-07-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://washerlab.top/about.html</loc>
    <lastmod>2026-07-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://washerlab.top/contact.html</loc>
    <lastmod>2026-07-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://washerlab.top/disclosure.html</loc>
    <lastmod>2026-07-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://washerlab.top/privacy.html</loc>
    <lastmod>2026-07-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://washerlab.top/terms.html</loc>
    <lastmod>2026-07-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
    
    return new Response(sitemap, {
      headers: { 'Content-Type': 'application/xml' }
    });
  }
  
  // Articles meta API (served by assets as well now)
  if (url.pathname === '/api/articles-meta.json') {
    // This file is now in site/api/ and will be served by Assets
    return new Response('Not Found', { status: 404 });
  }
  
  return new Response('Not Found', { status: 404 });
}
