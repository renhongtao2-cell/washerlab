const PRIMARY_DOMAIN = 'washerlab.top';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 1. HTTPS enforcement
    if (url.protocol === 'http:') {
      url.protocol = 'https:';
      return new Response('', { 
        status: 301, 
        headers: { 'Location': url.toString(), 'Cache-Control': 'public, max-age=31536000' } 
      });
    }
    
    // 2. www -> non-www redirect
    if (url.hostname.startsWith('www.')) {
      url.hostname = PRIMARY_DOMAIN;
      return new Response('', { 
        status: 301, 
        headers: { 'Location': url.toString(), 'Cache-Control': 'public, max-age=31536000' } 
      });
    }
    
    // 3. .html stripping
    if (url.pathname.endsWith('.html') && url.pathname !== '/index.html') {
      url.pathname = url.pathname.slice(0, -5);
      return new Response('', { 
        status: 301, 
        headers: { 'Location': url.toString(), 'Cache-Control': 'public, max-age=31536000' } 
      });
    }
    if (url.pathname === '/index.html') {
      url.pathname = '/';
      return new Response('', { 
        status: 301, 
        headers: { 'Location': url.toString(), 'Cache-Control': 'public, max-age=31536000' } 
      });
    }
    
    // Serve static assets
    let asset = await env.ASSETS.fetch(request);
    
    // If not found, return 404
    if (asset.status === 404) {
      return new Response('Not Found', { 
        status: 404,
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    return asset;
  }
};
