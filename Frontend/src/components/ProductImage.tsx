import { useProductImage, getProductPlaceholder } from '@/hooks/useProductImage'

interface Props {
  name: string
  category: string
  className?: string
  style?: React.CSSProperties
  alt?: string
}

export function ProductImage({ name, category, className, style, alt }: Props) {
  const src      = useProductImage(name, category)
  const fallback = getProductPlaceholder(name, category)

  return (
    <img
      src={src}
      alt={alt ?? name}
      className={className}
      style={style}
      loading="lazy"
      onError={e => {
        const img = e.target as HTMLImageElement
        if (img.src !== fallback) img.src = fallback
      }}
    />
  )
}
