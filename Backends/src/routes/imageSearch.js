/**
 * GET /api/image-search?q=<product+name>
 *
 * Searches Google Custom Search API for an image of the product.
 * Returns: { url: "https://..." } or { url: null, error: "..." }
 *
 * Required env vars:
 *   GOOGLE_API_KEY  — from console.developers.google.com
 *   GOOGLE_CX       — Custom Search Engine ID (cx), set to search all web
 *                     and enable "Image search" at cse.google.com
 *
 * Free tier: 100 queries/day. Results cached in-process for 24h.
 */

const express = require('express');
const router  = express.Router();

// In-process cache: query → { url, ts }
const cache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

router.get('/', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ url: null, error: 'Missing query' });

  // Append agriculture context so results stay on-topic
  const query = `${q} agriculture farming`;

  // Serve from cache if fresh
  const cached = cache.get(query);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return res.json({ url: cached.url });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  const cx     = process.env.GOOGLE_CX;

  if (!apiKey || !cx) {
    return res.status(503).json({
      url: null,
      error: 'GOOGLE_API_KEY and GOOGLE_CX not configured in .env'
    });
  }

  try {
    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.set('key',        apiKey);
    url.searchParams.set('cx',         cx);
    url.searchParams.set('q',          query);
    url.searchParams.set('searchType', 'image');
    url.searchParams.set('num',        '1');
    url.searchParams.set('imgType',    'photo');
    url.searchParams.set('safe',       'active');
    // Prefer medium-to-large images
    url.searchParams.set('imgSize',    'large');

    const response = await fetch(url.toString());
    const data     = await response.json();

    if (!response.ok) {
      console.error('[image-search] Google API error:', data?.error?.message);
      return res.status(502).json({ url: null, error: data?.error?.message || 'Google API error' });
    }

    const imageUrl = data?.items?.[0]?.link || null;

    // Cache the result
    cache.set(query, { url: imageUrl, ts: Date.now() });

    return res.json({ url: imageUrl });

  } catch (err) {
    console.error('[image-search] fetch error:', err.message);
    return res.status(500).json({ url: null, error: 'Internal error' });
  }
});

module.exports = router;
