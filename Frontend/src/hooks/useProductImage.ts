/**
 * useProductImage
 *
 * Fetches a Google image for a product by name via the backend
 * /api/image-search endpoint (which calls Google Custom Search API).
 *
 * Flow:
 *   1. Instant — show a relevant agriculture placeholder from local
 *      keyword map (no flash, works even if API is not configured)
 *   2. Check localStorage cache — if we fetched this product name
 *      in the last 7 days, use that URL immediately (no network)
 *   3. Fetch from backend /api/image-search?q=<productName>
 *      — backend appends "agriculture farming" to keep results on-topic
 *      — backend caches in-process for 24h
 *   4. On success → save to localStorage + update displayed image
 *   5. On failure → keep the placeholder (never shows broken image)
 */

import { useState, useEffect } from 'react'

/* ─── Agriculture placeholders — instant, no network needed ──────────── */
const U = (id: string) =>
  `https://images.unsplash.com/${id}?w=600&q=80&auto=format&fit=crop`

const IMG = {
  fertilizer:  U('photo-1625246333195-78d9c38ad449'), // fertilizer bags
  cotton:      U('photo-1584464491033-06628f3a6b7b'), // cotton bolls
  soybean:     U('photo-1585314062340-f1a5a7c9328d'), // soybean pods
  wheat:       U('photo-1574943320219-553eb213f72d'), // wheat field
  rice:        U('photo-1536304929831-ee1ca9d44906'), // rice paddy
  corn:        U('photo-1551754655-cd27e38d2076'),    // corn field
  seeds:       U('photo-1530836369250-ef72a3f5cda1'), // seeds
  spray:       U('photo-1601002683285-de024ee78e24'), // crop spraying
  equipment:   U('photo-1585911171167-1f66ea3de00c'), // farm equipment
  irrigation:  U('photo-1416879595882-3373a0480b5b'), // irrigation
  farm:        U('photo-1464226184884-fa280b87c399'), // farm field default
}

const KEYWORD_PLACEHOLDERS: Array<[string, string]> = [
  ['spray pump', IMG.equipment], ['sprayer',    IMG.equipment],
  ['pump',       IMG.equipment], ['tractor',    IMG.equipment],
  ['drip',       IMG.irrigation],['irrigation', IMG.irrigation],
  ['urea',       IMG.fertilizer],['dap',        IMG.fertilizer],
  ['npk',        IMG.fertilizer],['potash',     IMG.fertilizer],
  ['fertilizer', IMG.fertilizer],['compost',   IMG.fertilizer],
  ['cotton',     IMG.cotton],    ['soybean',    IMG.soybean],
  ['soya',       IMG.soybean],   ['wheat',      IMG.wheat],
  ['rice',       IMG.rice],      ['paddy',      IMG.rice],
  ['corn',       IMG.corn],      ['maize',      IMG.corn],
  ['herbicide',  IMG.spray],     ['pesticide',  IMG.spray],
  ['fungicide',  IMG.spray],     ['insecticide',IMG.spray],
  ['calaris',    IMG.spray],     ['weedicide',  IMG.spray],
  ['seed',       IMG.seeds],
]

function placeholder(name: string, category: string): string {
  const n = name.toLowerCase()
  const c = category.toLowerCase()
  let best = { len: 0, url: IMG.farm }
  for (const [kw, url] of KEYWORD_PLACEHOLDERS) {
    if (n.includes(kw) && kw.length > best.len) best = { len: kw.length, url }
  }
  if (best.len > 0) return best.url
  // Category fallback
  if (c.includes('fertilizer') || c.includes('fertiliser')) return IMG.fertilizer
  if (c.includes('seed')) return IMG.seeds
  if (c.includes('pesticide') || c.includes('herbicide') || c.includes('fungicide')) return IMG.spray
  if (c.includes('equipment') || c.includes('tool')) return IMG.equipment
  return IMG.farm
}

/* ─── localStorage cache helpers ────────────────────────────────────── */
const LS_PREFIX = 'krushi_img_'
const LS_TTL    = 7 * 24 * 60 * 60 * 1000 // 7 days

function lsGet(key: string): string | null {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key)
    if (!raw) return null
    const { url, ts } = JSON.parse(raw)
    if (Date.now() - ts > LS_TTL) { localStorage.removeItem(LS_PREFIX + key); return null }
    return url
  } catch { return null }
}

function lsSet(key: string, url: string) {
  try { localStorage.setItem(LS_PREFIX + key, JSON.stringify({ url, ts: Date.now() })) }
  catch { /* quota exceeded — ignore */ }
}

/* ─── Backend API URL ────────────────────────────────────────────────── */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/* ─── Main hook ──────────────────────────────────────────────────────── */
export function useProductImage(name: string, category: string): string {
  const [src, setSrc] = useState<string>(() => {
    // Step 1: check localStorage cache first (instant if cached)
    const cached = lsGet(name)
    if (cached) return cached
    // Step 2: show agriculture placeholder instantly
    return placeholder(name, category)
  })

  useEffect(() => {
    let cancelled = false

    async function fetchImage() {
      // Already have cached result — skip network
      if (lsGet(name)) return

      try {
        const res = await fetch(
          `${API_BASE}/api/image-search?q=${encodeURIComponent(name)}`,
          { signal: AbortSignal.timeout(5000) }
        )
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return
        if (data?.url) {
          lsSet(name, data.url)
          setSrc(data.url)
        }
      } catch {
        // Network error or timeout — keep placeholder, no crash
      }
    }

    fetchImage()
    return () => { cancelled = true }
  }, [name])

  return src
}

/* ─── Sync helper (for non-hook contexts) ───────────────────────────── */
export function getProductPlaceholder(name: string, category: string): string {
  return placeholder(name, category)
}
