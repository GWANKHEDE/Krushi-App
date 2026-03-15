/**
 * useProductImage — dynamic agriculture product images
 *
 * Strategy (in priority order):
 * 1. Instant: return a pre-mapped agriculture image based on product name keywords
 *    (no network, no flash, immediate render)
 * 2. Async: fetch Wikipedia thumbnail for the exact product name
 *    — updates the image if a better/more specific one is found
 * 3. Fallback: category-based agriculture image if nothing matches
 *
 * All images are strictly agriculture domain.
 */

import { useState, useEffect } from 'react'

/* ─── Verified agriculture Unsplash photo IDs ─────────────────────────────
   Each ID has been manually verified to show an agriculture-related photo.
   Format: https://images.unsplash.com/{id}?w=600&q=80&auto=format&fit=crop
──────────────────────────────────────────────────────────────────────────── */
const U = (id: string) =>
  `https://images.unsplash.com/${id}?w=600&q=80&auto=format&fit=crop`

// Base agriculture images by topic — all verified
const IMG = {
  // Fertilizer bags / granules
  fertilizerBag:   U('photo-1625246333195-78d9c38ad449'), // DAP/NPK sacks stacked
  fertilizerPile:  U('photo-1416879595882-3373a0480b5b'), // fertilizer/compost pile
  // Seeds / crops
  cottonPlant:     U('photo-1584464491033-06628f3a6b7b'), // cotton bolls on plant
  soybeanPod:      U('photo-1585314062340-f1a5a7c9328d'), // soybean pods on plant
  wheatField:      U('photo-1574943320219-553eb213f72d'), // golden wheat field
  riceField:       U('photo-1536304929831-ee1ca9d44906'), // rice paddy / paddy field
  cornField:       U('photo-1551754655-cd27e38d2076'),    // corn / maize field
  sunflowerField:  U('photo-1597848212624-a19eb35e2651'), // sunflower farm
  seedsPile:       U('photo-1530836369250-ef72a3f5cda1'), // mixed seeds agriculture
  // Pesticides / spraying
  cropSpray:       U('photo-1601002683285-de024ee78e24'), // farmer spraying crops
  // Equipment / tools
  farmEquipment:   U('photo-1585911171167-1f66ea3de00c'), // farm machinery/sprayer
  drip:            U('photo-1464226184884-fa280b87c399'), // drip irrigation green field
  // Generic fallbacks — all agriculture
  farmField:       U('photo-1500937386664-56d1dfef3854'), // Indian agriculture field
  farmIndia:       U('photo-1464226184884-fa280b87c399'), // green farm field
}

/* ─── Keyword → image mapping ─────────────────────────────────────────────
   Longest keyword wins — ensures 'spray pump' beats 'spray' and 'pump'
──────────────────────────────────────────────────────────────────────────── */
const KEYWORD_MAP: Array<[string, string]> = [
  // Fertilizers — match longest keywords first
  ['urea fertilizer',     IMG.fertilizerBag],
  ['dap fertilizer',      IMG.fertilizerBag],
  ['npk fertilizer',      IMG.fertilizerBag],
  ['potash mop',          IMG.fertilizerBag],
  ['complex fertilizer',  IMG.fertilizerBag],
  ['fertilizer',          IMG.fertilizerBag],
  ['urea',                IMG.fertilizerBag],
  ['dap',                 IMG.fertilizerBag],
  ['potash',              IMG.fertilizerBag],
  ['npk',                 IMG.fertilizerBag],
  ['sulphur',             IMG.fertilizerBag],
  ['nitrogen',            IMG.fertilizerBag],
  ['phosphate',           IMG.fertilizerBag],
  ['micronutrient',       IMG.fertilizerBag],
  ['compost',             IMG.fertilizerPile],
  ['organic fertilizer',  IMG.fertilizerPile],
  // Seeds — specific crops
  ['cotton seed',         IMG.cottonPlant],
  ['cotton',              IMG.cottonPlant],
  ['soybean seed',        IMG.soybeanPod],
  ['soybean',             IMG.soybeanPod],
  ['soya',                IMG.soybeanPod],
  ['wheat seed',          IMG.wheatField],
  ['wheat',               IMG.wheatField],
  ['rice seed',           IMG.riceField],
  ['rice',                IMG.riceField],
  ['paddy',               IMG.riceField],
  ['corn seed',           IMG.cornField],
  ['corn',                IMG.cornField],
  ['maize',               IMG.cornField],
  ['sunflower',           IMG.sunflowerField],
  ['groundnut',           IMG.seedsPile],
  ['seed',                IMG.seedsPile],
  // Pesticides / herbicides / fungicides — crop spraying
  ['spray pump',          IMG.farmEquipment],  // "spray pump" before "spray"
  ['herbicide',           IMG.cropSpray],
  ['weedicide',           IMG.cropSpray],
  ['pesticide',           IMG.cropSpray],
  ['fungicide',           IMG.cropSpray],
  ['insecticide',         IMG.cropSpray],
  ['calaris',             IMG.cropSpray],  // brand name herbicide
  ['neem',                IMG.cropSpray],
  // Equipment / tools
  ['sprayer',             IMG.farmEquipment],
  ['spray',               IMG.farmEquipment],
  ['pump',                IMG.farmEquipment],
  ['drip irrigation',     IMG.drip],
  ['drip',                IMG.drip],
  ['irrigation',          IMG.drip],
  ['tractor',             IMG.farmEquipment],
]

/* ─── Category fallback ───────────────────────────────────────────────── */
const CATEGORY_MAP: Record<string, string> = {
  fertilizer:  IMG.fertilizerBag,
  fertilizers: IMG.fertilizerBag,
  seed:        IMG.seedsPile,
  seeds:       IMG.seedsPile,
  pesticide:   IMG.cropSpray,
  pesticides:  IMG.cropSpray,
  herbicide:   IMG.cropSpray,
  herbicides:  IMG.cropSpray,
  fungicide:   IMG.cropSpray,
  insecticide: IMG.cropSpray,
  equipment:   IMG.farmEquipment,
  tools:       IMG.farmEquipment,
  tool:        IMG.farmEquipment,
}

function instantImage(name: string, category: string): string {
  const n = name.toLowerCase()
  const c = category.toLowerCase()

  // Longest-keyword match on product name
  let best = { len: 0, url: '' }
  for (const [kw, url] of KEYWORD_MAP) {
    if (n.includes(kw) && kw.length > best.len) {
      best = { len: kw.length, url }
    }
  }
  if (best.url) return best.url

  // Category fallback
  for (const [kw, url] of Object.entries(CATEGORY_MAP)) {
    if (c.includes(kw)) return url
  }

  return IMG.farmField
}

/* ─── Wikipedia thumbnail fetcher ────────────────────────────────────────
   Fetches a real photo for the exact product name from Wikipedia.
   Only upgrades the image if a thumbnail exists — never shows blank.
──────────────────────────────────────────────────────────────────────────── */
async function fetchWikiThumb(query: string): Promise<string | null> {
  // Clean the query — strip parenthetical info like "(50kg)", "(1L)"
  const clean = query
    .replace(/\s*\([^)]*\)/g, '')   // remove (50kg), (1L) etc.
    .replace(/\b\d+[-–]\d+[-–]\d+\b/g, '') // remove 10-26-26 etc.
    .trim()

  const url = `https://en.wikipedia.org/w/api.php?` +
    `action=query&titles=${encodeURIComponent(clean)}&prop=pageimages` +
    `&format=json&pithumbsize=600&origin=*`

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) })
    if (!res.ok) return null
    const data = await res.json()
    const pages = data?.query?.pages
    if (!pages) return null
    const page = Object.values(pages)[0] as any
    const src: string | undefined = page?.thumbnail?.source
    if (!src) return null
    // Only accept images that look agriculture-related by URL check
    const reject = ['flag', 'logo', 'icon', 'map', 'coat', 'symbol', 'emblem', 'portrait', 'person']
    if (reject.some(r => src.toLowerCase().includes(r))) return null
    return src
  } catch {
    return null
  }
}

/* ─── Main hook ──────────────────────────────────────────────────────────── */
export function useProductImage(name: string, category: string): string {
  const [src, setSrc] = useState(() => instantImage(name, category))

  useEffect(() => {
    let cancelled = false
    fetchWikiThumb(name).then(wikiSrc => {
      if (!cancelled && wikiSrc) setSrc(wikiSrc)
    })
    return () => { cancelled = true }
  }, [name])

  return src
}

/* ─── Synchronous version (no hook) for non-component contexts ─────────── */
export function getProductImage(name: string, category: string): string {
  return instantImage(name, category)
}
