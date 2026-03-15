/**
 * useProductImage — Dynamic product images, no API key, no backend
 *
 * Uses Wikipedia's public API (CORS enabled, free, no auth) to fetch
 * the article thumbnail for a product name. Wikipedia has high-quality
 * photos for every agricultural product: cotton, soybean, urea, DAP,
 * herbicides, sprayers, etc.
 *
 * Query strategy (tries in order until an image is found):
 *   1. Core product term extracted from name (e.g. "Cotton" from "Cotton Seeds (1kg)")
 *   2. Full cleaned name (parentheticals stripped)
 *   3. Category name
 *   4. Curated agriculture Unsplash fallback (always agriculture-domain)
 *
 * Caching: localStorage with 30-day TTL — each product name fetched once.
 */

import { useState, useEffect } from 'react'

/* ─── Curated agriculture fallbacks (Unsplash, verified) ──────────────────
   Used ONLY when Wikipedia has no image. All are agriculture domain.
────────────────────────────────────────────────────────────────────────── */
const FALLBACKS: Record<string, string> = {
  // Fertilizers
  urea:        'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80&fit=crop',
  dap:         'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80&fit=crop',
  npk:         'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80&fit=crop',
  potash:      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80&fit=crop',
  fertilizer:  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80&fit=crop',
  // Seeds / crops
  cotton:      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&q=80&fit=crop',
  soybean:     'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&q=80&fit=crop',
  soya:        'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&q=80&fit=crop',
  wheat:       'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80&fit=crop',
  rice:        'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&q=80&fit=crop',
  corn:        'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80&fit=crop',
  maize:       'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80&fit=crop',
  seed:        'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda1?w=600&q=80&fit=crop',
  // Pesticides / spraying
  herbicide:   'https://images.unsplash.com/photo-1601002683285-de024ee78e24?w=600&q=80&fit=crop',
  pesticide:   'https://images.unsplash.com/photo-1601002683285-de024ee78e24?w=600&q=80&fit=crop',
  fungicide:   'https://images.unsplash.com/photo-1601002683285-de024ee78e24?w=600&q=80&fit=crop',
  insecticide: 'https://images.unsplash.com/photo-1601002683285-de024ee78e24?w=600&q=80&fit=crop',
  // Equipment
  sprayer:     'https://images.unsplash.com/photo-1585911171167-1f66ea3de00c?w=600&q=80&fit=crop',
  pump:        'https://images.unsplash.com/photo-1585911171167-1f66ea3de00c?w=600&q=80&fit=crop',
  // Default
  default:     'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80&fit=crop',
}

function getFallback(name: string, category: string): string {
  const n = name.toLowerCase()
  const c = category.toLowerCase()
  // Longest keyword match
  let best = { len: 0, url: '' }
  for (const [kw, url] of Object.entries(FALLBACKS)) {
    if (kw === 'default') continue
    if (n.includes(kw) && kw.length > best.len) best = { len: kw.length, url }
  }
  if (best.url) return best.url
  for (const [kw, url] of Object.entries(FALLBACKS)) {
    if (c.includes(kw)) return url
  }
  return FALLBACKS.default
}

/* ─── Extract meaningful Wikipedia search terms from a product name ────────
   "Cotton Seeds (1kg)"     → ["Cotton", "Cotton Seeds", "Seeds"]
   "DAP Fertilizer (50kg)"  → ["DAP fertilizer", "Diammonium phosphate", "Fertilizer"]
   "Calaris Herbicide (1L)" → ["Herbicide", "Calaris"]
   "NPK 10-26-26 (50kg)"    → ["NPK fertilizer", "Fertilizer"]
   "Spray Pump (16L)"       → ["Knapsack sprayer", "Agricultural sprayer"]
────────────────────────────────────────────────────────────────────────── */

// Manual overrides for product terms that Wikipedia knows by a different name
const WIKI_OVERRIDES: Array<[string, string[]]> = [
  ['urea',         ['Urea fertilizer', 'Urea']],
  ['dap',          ['Diammonium phosphate', 'DAP fertilizer']],
  ['npk',          ['NPK fertilizer', 'Fertilizer']],
  ['potash',       ['Potassium chloride', 'Potash']],
  ['mop',          ['Potassium chloride']],
  ['cotton seed',  ['Cotton', 'Gossypium']],
  ['cotton',       ['Cotton', 'Gossypium']],
  ['soybean',      ['Soybean', 'Soy']],
  ['soya',         ['Soybean']],
  ['calaris',      ['Mesotrione', 'Herbicide']],
  ['spray pump',   ['Knapsack sprayer', 'Agricultural sprayer']],
  ['sprayer',      ['Knapsack sprayer', 'Agricultural sprayer']],
  ['herbicide',    ['Herbicide']],
  ['fungicide',    ['Fungicide']],
  ['insecticide',  ['Insecticide']],
  ['pesticide',    ['Pesticide']],
  ['fertilizer',   ['Fertilizer']],
  ['wheat',        ['Wheat']],
  ['rice',         ['Rice']],
  ['maize',        ['Maize', 'Corn']],
  ['corn',         ['Maize', 'Corn']],
  ['sunflower',    ['Sunflower']],
  ['groundnut',    ['Peanut', 'Groundnut']],
  ['sugarcane',    ['Sugarcane']],
  ['onion',        ['Onion']],
  ['tomato',       ['Tomato']],
  ['chilli',       ['Chili pepper']],
  ['turmeric',     ['Turmeric']],
]

function getSearchTerms(name: string, category: string): string[] {
  const n = name.toLowerCase()

  // Check overrides first (longest match)
  let best: string[] | null = null
  let bestLen = 0
  for (const [kw, terms] of WIKI_OVERRIDES) {
    if (n.includes(kw) && kw.length > bestLen) {
      best = terms
      bestLen = kw.length
    }
  }
  if (best) return best

  // Auto-extract: strip parentheticals and numeric formulas, take first 2 words
  const clean = name
    .replace(/\s*\([^)]*\)/g, '')       // remove (50kg), (1L)
    .replace(/\b\d+[-–]\d+[-–]\d+\b/g, '') // remove 10-26-26
    .replace(/\b\d+\s*(kg|l|ml|g|lb)\b/gi, '') // remove 50kg etc
    .trim()

  const words = clean.split(/\s+/).filter(w => w.length > 2)
  const terms: string[] = []

  // Full cleaned name
  if (clean.length > 2) terms.push(clean)

  // First word only (most specific noun)
  if (words[0]) terms.push(words[0])

  // Category as last resort
  if (category && category.length > 2) terms.push(category)

  return [...new Set(terms)]
}

/* ─── Wikipedia thumbnail API ─────────────────────────────────────────────
   GET https://en.wikipedia.org/w/api.php
     ?action=query&titles=Cotton&prop=pageimages&format=json
     &pithumbsize=600&origin=*
   → returns article thumbnail URL
   CORS: enabled via origin=* (no proxy needed)
────────────────────────────────────────────────────────────────────────── */
async function fetchWikiImage(searchTerm: string): Promise<string | null> {
  const url =
    `https://en.wikipedia.org/w/api.php?action=query` +
    `&titles=${encodeURIComponent(searchTerm)}` +
    `&prop=pageimages&format=json&pithumbsize=600&origin=*`

  try {
    const res  = await fetch(url, { signal: AbortSignal.timeout(4000) })
    if (!res.ok) return null
    const data = await res.json()
    const pages = data?.query?.pages
    if (!pages) return null

    const page = Object.values(pages)[0] as any

    // -1 means page not found
    if (page?.missing !== undefined) return null

    const src: string | undefined = page?.thumbnail?.source
    if (!src) return null

    // Reject non-agricultural images by filename keywords
    const srcLower = src.toLowerCase()
    const reject = [
      'flag', 'logo', 'coat_of_arms', 'map', 'icon', 'symbol',
      'emblem', 'portrait', 'person', 'athlete', 'player',
      'cricketer', 'politician', 'actor', 'singer', 'gym',
      'fitness', 'bodybuilder', 'woman', 'man_', 'selfie'
    ]
    if (reject.some(r => srcLower.includes(r))) return null

    return src
  } catch {
    return null
  }
}

/* ─── localStorage cache (30-day TTL) ─────────────────────────────────── */
const LS_KEY = (n: string) => `krushi_img2_${n.toLowerCase().slice(0, 60)}`
const TTL = 30 * 24 * 60 * 60 * 1000

function lsGet(name: string): string | null {
  try {
    const raw = localStorage.getItem(LS_KEY(name))
    if (!raw) return null
    const { url, ts } = JSON.parse(raw)
    if (Date.now() - ts > TTL) { localStorage.removeItem(LS_KEY(name)); return null }
    return url as string
  } catch { return null }
}

function lsSet(name: string, url: string) {
  try {
    localStorage.setItem(LS_KEY(name), JSON.stringify({ url, ts: Date.now() }))
  } catch { /* quota full — ignore */ }
}

/* ─── Main hook ─────────────────────────────────────────────────────────── */
export function useProductImage(name: string, category: string): string {
  const [src, setSrc] = useState<string>(() => {
    // Check cache first — instant if previously fetched
    const cached = lsGet(name)
    if (cached) return cached
    // Instant agriculture placeholder while fetching
    return getFallback(name, category)
  })

  useEffect(() => {
    let cancelled = false

    // Already cached — no network needed
    if (lsGet(name)) return

    async function resolve() {
      const terms = getSearchTerms(name, category)

      for (const term of terms) {
        if (cancelled) return
        const imgUrl = await fetchWikiImage(term)
        if (imgUrl && !cancelled) {
          lsSet(name, imgUrl)
          setSrc(imgUrl)
          return
        }
      }
      // All Wikipedia attempts failed — cache the fallback so we don't retry
      const fallback = getFallback(name, category)
      if (!cancelled) {
        lsSet(name, fallback)
        setSrc(fallback)
      }
    }

    resolve()
    return () => { cancelled = true }
  }, [name, category])

  return src
}

export function getProductPlaceholder(name: string, category: string): string {
  return getFallback(name, category)
}
