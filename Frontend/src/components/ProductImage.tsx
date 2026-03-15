/**
 * ProductImage — renders a product photo dynamically
 *
 * Shows an instant agriculture image from keyword map,
 * then upgrades to the Wikipedia thumbnail if one is found.
 * Falls back to the instant image on any load error.
 */
import { useProductImage } from '@/hooks/useProductImage'
import { useState } from 'react'

interface Props {
  name: string
  category: string
  className?: string
  style?: React.CSSProperties
  alt?: string
}

export function ProductImage({ name, category, className, style, alt }: Props) {
  const src = useProductImage(name, category)
  const fallback = src // already set to agriculture image

  return (
    <img
      src={src}
      alt={alt || name}
      className={className}
      style={style}
      loading="lazy"
      onError={e => {
        const img = e.target as HTMLImageElement
        // Prevent infinite loop if fallback also fails
        if (img.src !== fallback) img.src = fallback
        else img.style.display = 'none'
      }}
    />
  )
}
